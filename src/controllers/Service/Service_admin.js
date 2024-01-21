const TypeService = require('../../models/TypeService')
const Service = require('../../models/Service')
const Hospital = require('../../models/Hospital')
const func = require('../../services/function')
const { StatusCodes } = require('http-status-codes')



const compareArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const isEqual = arr1.every((value) => arr2.includes(value));
  return isEqual

}


const get_list_service = async (req, name) => {
  let serviceName = req.query.serviceName || "";
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.pageNum || 1;
  console.log(pageSize);
  console.log(pageNum);
  const list_service = await TypeService.find(
    {
      serviceName: { $regex: serviceName }
    })
    .skip(Number(pageSize * (pageNum - 1)))
    .limit(Number(pageSize))

  return list_service
}

exports.create_service = async (req, res) => {
  const { serviceName, serviceCode } = req.body;
  const user_login = req.user.data;

  if (!serviceName) {
    return res.status(400).json({ message: "input is not valid", statusCode: 400 })
  }

  if (user_login.accountType !== 0) {
    return res.status(400).json({ message: "Function is not valid", statusCode: 400 })
  }

  const maxId_service = await func.maxID(TypeService)
  console.log(maxId_service);
  const new_type_service = new TypeService({
    _id: maxId_service + 1,
    serviceCode: serviceCode,
    serviceName: serviceName,
    createAt: new Date(),
    userCreate: user_login._id,
  })

  await new_type_service.save()
    .then(async () => {
      const list_service = await get_list_service(req)
      return res.status(StatusCodes.OK)
        .json({
          data: {
            content: list_service,
            total_record: list_service.length,
          },
          message: "create service success",
          statusCode: 200
        })
    })
    .catch(async (err) => {
      return res.status(400)
        .json({
          message: err.message,
          statusCode: 400
        })
    })
}

exports.get_list_sevice_service = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const list_service = await get_list_service(req)

  return res.status(StatusCodes.OK)
    .json({
      data: {
        content: list_service,
        page: page,
        size: pageSize,
        total_record: list_service.length,
        total_page: parseInt(list_service.length / pageSize + 1),
      },
      message: "success", statusCode: 200
    })
}


exports.add_service_service = async (req, res) => {
  const { serviceName, serviceCost, HosId, SpecialistId, type_service } = req.body;

  const user_login = req.user.data;

  if (!serviceName || isNaN(serviceCost) || Number(serviceCost) <= 0 || type_service.length <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "bad request", statusCode: StatusCodes.BAD_REQUEST })
  }

  if (user_login.accountType != 0 && user_login.accountType != 3) {
    return res.status(401).json({ message: "truy cập không hợp lệ !", statusCode: 401 })
  }
  const hos_id = user_login.accountType == 0 ? HosId : user_login._id

  if (!hos_id) {
    return res.status(400).json({ message: "Không thể tìm thấy cơ sở y tế !", statusCode: 400 })
  }

  if (SpecialistId) {
    check_exists_spec = await Hospital.findOne({
      _id: hos_id
    })

    if (!compareArrays(SpecialistId, check_exists_spec.Specialist_ID)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không tìm thấy chuyên khoa của cơ sở y tế !", statusCode: StatusCodes.BAD_REQUEST })
    }
  }

  const check_type_service = await TypeService.find({ serviceCode: { $in: type_service } })
  if (check_type_service.length != type_service.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không tìm thấy loại dịch vụ !", statusCode: StatusCodes.BAD_REQUEST })
  }

  const maxId_service = await func.maxID(Service)

  const new_service = new Service({
    _id: maxId_service + 1,
    serviceName: serviceName,
    serviceCost: serviceCost,
    HosId: hos_id,
    SpecialistId: SpecialistId,
    type_service_code: type_service,
  })
  await new_service.save()
    .then(() => { return res.status(StatusCodes.OK).json({ message: "Đăng kí dịch vụ thành công.", statusCode: 200 }) })
    .catch((err) => { return res.status(404).json({ message: err.message, statusCode: 404 }) })

}

exports.update_name_service_service = async (req, res) => {
  const { service_id, serviceCost, serviceName } = req.body;

  const user_login = req.user.data;
  if (!serviceName || !service_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "bad request", statusCode: StatusCodes.BAD_REQUEST })
  }


  const service = await Service.findOne({
    _id: service_id
  })
  if (service) {
    if ((user_login.accountType != 0 && user_login.accountType != 3) ||
      (user_login.accountType != 3 && service.HosId != user_login._id)
    ) {
      return res.status(401).json({ message: "truy cập không hợp lệ !", statusCode: 401 })
    }

    await Service.findOneAndUpdate({
      _id: service_id
    }, {
      serviceName: serviceName,
      serviceCost: serviceCost
    })
      .then(() => { return res.status(StatusCodes.OK).json({ message: "Đăng kí dịch vụ thành công.", statusCode: 200 }) })
      .catch((err) => { return res.status(404).json({ message: err.message, statusCode: 404 }) })
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không thể tìm thấy dịch vụ !", statusCode: StatusCodes.BAD_REQUEST })
  }
}