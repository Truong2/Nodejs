const TypeService = require('../../models/TypeService')
const Service = require('../../models/Service')
const Hospital = require('../../models/Hospital')
const func = require('../../services/function')
const { StatusCodes } = require('http-status-codes')
const { Types } = require('mongoose')


const get_list_service = async (req) => {
  let serviceName = req.query.serviceName || "";
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.pageNum || 1;

  const list_service = await TypeService.find(
    {
      serviceName: { $regex: serviceName }
    })
    .skip(Number(pageSize * (pageNum - 1)))
    .limit(Number(pageSize))

  const total = await TypeService.find().count()

  return { list_service, pageSize, pageNum, total }
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
  const new_type_service = new TypeService({
    _id: maxId_service + 1,
    serviceCode: serviceCode,
    serviceName: serviceName,
    createAt: new Date(),
    userCreate: user_login._id,
  })

  await new_type_service.save()
    .then(async () => {
      const { list_service, pageSize, pageNum, total } = await get_list_service(req)
      return res.status(StatusCodes.OK)
        .json({
          data: {
            content: list_service,
            page: pageNum,
            size: pageSize,
            pageSize: list_service.length,
            totalElement: total,
            total_page: parseInt(list_service.length / pageSize + 1),
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

  const { list_service, pageSize, pageNum, total } = await get_list_service(req)

  return res.status(StatusCodes.OK)
    .json({
      data: {
        content: list_service,
        page: pageNum,
        size: pageSize,
        pageSize: list_service.length,
        totalElement: total,
        total_page: parseInt(list_service.length / pageSize + 1),
      },
      message: "success",
      statusCode: 200
    })
}

exports.update_name_service_service = async (req, res) => {
  const { service_name } = req.body;
  const service_id = req.params.service_id;

  const user_login = req.user.data;
  if (user_login.accountType != 0) {
    return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json({ message: "Bad request !", statusCode: StatusCodes.NON_AUTHORITATIVE_INFORMATION })
  }

  if (!service_id || isNaN(service_id) || Number(service_id) <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request !", statusCode: StatusCodes.BAD_REQUEST })
  }

  const service_type = await TypeService.exists({
    _id: service_id
  })

  if (!service_type) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Không tìm thấy dịch vụ !",
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  await TypeService.findOneAndUpdate({
    _id: Number(service_id)
  }, {
    serviceName: service_name
  })
    .then(async () => {
      const { list_service, pageSize, pageNum, total } = await get_list_service(req)
      return res.status(StatusCodes.OK).json({
        data: {
          content: list_service,
          page: pageNum,
          size: pageSize,
          pageSize: list_service.length,
          totalElement: total,
          total_page: parseInt(list_service.length / pageSize + 1),
        },
        message: "Cập nhật thành công.",
        statusCode: StatusCodes.OK
      })
    })
    .catch(err => {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Cập nhật không thành công !", statusCode: StatusCodes.BAD_REQUEST
      })
    })
}

exports.delete_service_service = async (req, res) => {

  const service_id = req.params.service_id;

  const user_login = req.user.data;
  if (user_login.accountType != 0) {
    return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json({ message: "Bad request !", statusCode: StatusCodes.NON_AUTHORITATIVE_INFORMATION })
  }

  if (!service_id || isNaN(service_id) || Number(service_id) <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request !", statusCode: StatusCodes.BAD_REQUEST })
  }

  const service_type = await TypeService.exists({
    _id: service_id
  })

  if (!service_type) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Không tìm thấy dịch vụ !",
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  await TypeService.findOneAndDelete({ _id: service_id })
    .then(async () => {
      const { list_service, pageSize, pageNum, total } = await get_list_service(req)
      return res.status(StatusCodes.OK).json({
        data: {
          content: list_service,
          page: pageNum,
          size: pageSize,
          pageSize: list_service.length,
          totalElement: total,
          total_page: parseInt(list_service.length / pageSize + 1),
        }, 
        message: "Xóa loại thành công.",
        statusCode: StatusCodes.OK
      })
    })
    .catch(err => {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Xóa loại không thành công !", statusCode: StatusCodes.BAD_REQUEST
      })
    })
}