const TypeService = require('../../models/TypeService')
const TimeWorking = require("../../models/TimeWorking")
const Service = require('../../models/Service')
const User = require('../../models/Users')
const func = require('../../services/function')
const { StatusCodes } = require('http-status-codes')

const compareArrays = (arr1, arr2) => {
  const isEqual = arr1.every((value) => arr2.includes(value));
  return isEqual
}

const query_list_service = async (req, hospital_id) => {
  const serviceName = req.query.serviceName || "";
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.pageNum || 1;

  const list_service = await Service.aggregate([
    {
      $match: {
        $and: [
          { HosId: Number(hospital_id) },
          { serviceName: { $regex: serviceName } }
        ]
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "HosId",
        foreignField: "_id",
        as: "Hospital"
      }
    },
    {
      $unwind: {
        path: "$Hospital",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "specialists",
        localField: "SpecialistId",
        foreignField: "_id",
        as: "Specialist"
      }
    },
    {
      $unwind: {
        path: "$Specialist",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "typeservices",
        localField: "type_service",
        foreignField: "_id",
        as: "SeviceType"
      }
    },
    {
      $unwind: {
        path: "$SeviceType",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'timeworkings',
        localField: "calendarWorking",
        foreignField: "_id",
        as: "TimeWorking"
      }
    },
    {
      $unwind: {
        path: "$TimeWorking",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$serviceName" },
        cost: { $first: "$serviceCost" },
        user_number: { $first: "$service_userUsed" },
        hospital: { $first: "$Hospital.name" },
        specialist: { $addToSet: "$Specialist.Specialist_Name" },
        serviceType: { $addToSet: "$SeviceType.serviceName" },
        status: { $first: "$status" },
        timeWorking: { $addToSet: "$TimeWorking.time_working" }
      }
    },
    {
      $sort: {
        name: 1
      }
    }
  ])

  const total = await Service.find({ HosId: hospital_id }).count()

  return { list_service, pageNum, pageSize, total }
}

exports.add_service_service = async (req, res) => {
  const { serviceName,
    serviceCost,
    SpecialistId,
    type_service,
    time_working } = req.body;

  const check_time_working = await TimeWorking.find({ _id: { $in: time_working.map(Number) } })
  if (check_time_working.length !== time_working.length) {
    return res.status(StatusCodes.PRECONDITION_FAILED).json({ message: "time working is not valid", statusCode: StatusCodes.PRECONDITION_FAILED })
  }

  const hospital_id = Number(req.params.hospital_id);
  const check_exists_hos = await User.exists({ _id: hospital_id, type: 3 })
  if (!check_exists_hos) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Không tìm thấy cơ sở y tế",
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  const user_login = req.user.data;

  if (!serviceName || isNaN(serviceCost) || Number(serviceCost) <= 0 || type_service.length <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request ! ", statusCode: StatusCodes.BAD_REQUEST })
  }

  if ((user_login.accountType != 0 && user_login.accountType != 3) && user_login._id != hospital_id) {
    return res.status(401).json({ message: "truy cập không hợp lệ !", statusCode: 401 })
  }
  const hos_id = user_login.accountType == 0 ? hospital_id : user_login._id;

  if (!hos_id) {
    return res.status(400).json({ message: "Không thể tìm thấy cơ sở y tế !", statusCode: 400 })
  }

  if (SpecialistId) {
    const check_exists_spec = await User.findOne({
      _id: hos_id,
      type: 3
    })

    if (!compareArrays(SpecialistId, check_exists_spec.specialistId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không tìm thấy chuyên khoa của cơ sở y tế !", statusCode: StatusCodes.BAD_REQUEST })
    }
  }

  const check_type_service = await TypeService.find({ _id: { $in: type_service } })
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
    type_service: type_service,
    calendarWorking: time_working
  })

  await new_service.save()
    .then(async () => {
      const { list_service, pageNum, pageSize, total } = await query_list_service(req, hospital_id);
      return res.status(StatusCodes.OK).json({
        data: {
          content: list_service,
          page: pageNum,
          size: pageSize,
          pageSize: list_service?.length,
          totalElement: total,
          total_page: parseInt(list_service?.length / pageSize + 1),
        },
        message: "Tạo dịch vụ thành công.",
        statusCode: 200
      })
    })
    .catch((err) => { return res.status(404).json({ message: err.message, statusCode: 404 }) })
}

exports.update_service_service = async (req, res) => {
  const { serviceCost, serviceName, SpecialistId, type_service, time_working } = req.body;

  const hospital_id = Number(req.params.hospital_id);
  const service_id = Number(req.params.service_id);
  const user_login = req.user.data;

  const hos_id = hospital_id;

  const check_time_working = await TimeWorking.find({ _id: { $in: time_working.map(Number) } })
  if (check_time_working.length !== time_working.length) {
    return res.status(StatusCodes.PRECONDITION_FAILED).json({ message: "time working is not valid", statusCode: StatusCodes.PRECONDITION_FAILED })
  }

  const check_exists_hos = await User.exists({ _id: hospital_id, type: 3 })
  if (!check_exists_hos) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Không tìm thấy cơ sở y tế !",
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  if (!service_id || isNaN(service_id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ messae: "Bad request !", statusCode: StatusCodes.BAD_REQUEST })
  }

  if (SpecialistId) {
    const check_exists_spec = await User.findOne({
      _id: hos_id,
      type: 3
    })
    if (!compareArrays(SpecialistId, check_exists_spec.specialistId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không tìm thấy chuyên khoa của cơ sở y tế !", statusCode: StatusCodes.BAD_REQUEST })
    }
  }

  const check_type_service = await TypeService.find({ _id: { $in: type_service } })
  if (check_type_service.length != type_service.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không tìm thấy loại dịch vụ !", statusCode: StatusCodes.BAD_REQUEST })
  }

  const service = await Service.findOne({
    _id: service_id,
    HosId: hos_id
  })

  if (service) {
    if ((user_login.accountType != 0 && user_login.accountType != 3) ||
      (user_login.accountType == 3 && service.HosId != user_login._id)
    ) {
      return res.status(401).json({ message: "truy cập không hợp lệ !", statusCode: 401 })
    }

    await Service.findOneAndUpdate({
      _id: service_id,
      HosId: hos_id,
    }, {
      serviceName: serviceName,
      serviceCost: serviceCost,
      SpecialistId: SpecialistId,
      type_service: type_service,
      time_working: time_working,
    })
      .then(async () => {
        const { list_service, pageNum, pageSize, total } = await query_list_service(req, hospital_id);

        return res.status(StatusCodes.OK).json({
          data: {
            content: list_service,
            page: pageNum,
            size: pageSize,
            pageSize: list_service?.length,
            totalElement: total,
            total_page: parseInt(list_service?.length / pageSize + 1),
          },
          message: "Cập nhật dịch vụ thành công.",
          statusCode: 200
        })
      })
      .catch((err) => { return res.status(404).json({ message: err.message, statusCode: 404 }) })
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không thể tìm thấy dịch vụ !", statusCode: StatusCodes.BAD_REQUEST })
  }
}

exports.detail_service_service = async (req, res) => {
  const { service_id } = req.params;

  const service = await Service.aggregate([
    {
      $match: {
        _id: Number(service_id)
      }
    },
    {
      $lookup: {
        from: "hospitals",
        localField: "HosId",
        foreignField: "_id",
        as: "User"
      }
    },
    {
      $unwind: {
        path: "$User",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "specialists",
        localField: "SpecialistId",
        foreignField: "_id",
        as: "Specialist"
      }
    },
    {
      $unwind: {
        path: "$Specialist",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "typeservices",
        localField: "type_service",
        foreignField: "_id",
        as: "SeviceType"
      }
    },
    {
      $unwind: {
        path: "$SeviceType",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'timeworkings',
        localField: "calendarWorking",
        foreignField: "_id",
        as: "TimeWorking"
      }
    },
    {
      $unwind: {
        path: "$TimeWorking",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$serviceName" },
        cost: { $first: "$serviceCost" },
        user_number: { $first: "$service_userUsed" },
        hospital: { $first: "$User.hospitalName" },
        specialist: { $first: "$Specialist.id" },
        serviceType: { $addToSet: "$SeviceType.serviceName" },
        status: { $first: "$status" },
        timeWorking: { $addToSet: "$TimeWorking.time_working" }
      }
    },
    {
      $sort: {
        name: 1
      }
    }
  ])

  if (service.length == 1) {
    return res.status(StatusCodes.OK).json({
      data: service[0],
      message: "success.",
      statusCode: StatusCodes.OK
    })
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Không tìm thấy dịch vụ !",
      statusCode: StatusCodes.BAD_REQUEST
    })
  }
}

exports.get_list_service_service = async (req, res) => {
  const hospital_id = Number(req.params.hospital_id);

  check_exists_hos = await User.exists({ _id: hospital_id })
  if (!check_exists_hos) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Không tìm thấy cơ sở y tế !",
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  const { list_service, pageNum, pageSize, total } = await query_list_service(req, hospital_id);

  return res.status(StatusCodes.OK).json({
    data: {
      content: list_service,
      page: pageNum,
      size: pageSize,
      pageSize: list_service?.length,
      totalElement: total,
      total_page: parseInt(list_service?.length / pageSize + 1),
    },
    message: "success",
    statusCode: 200
  })
}

exports.delete_service_service = async (req, res) => {
  const hospital_id = req.params.hospital_id;
  const service_id = Number(req.params.service_id);
  const user_login = req.user.data;

  const check_exists_hos = await User.exists({ _id: hospital_id })
  if (!check_exists_hos) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Không tìm thấy cơ sở y tế !",
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  if (!service_id || isNaN(service_id) || !hospital_id || isNaN(hospital_id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ messae: "Bad request !", statusCode: StatusCodes.BAD_REQUEST })
  }

  const service = await Service.findOne({
    _id: service_id,
    HosId: hospital_id
  })
  if (!service) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không thể tìm thấy dịch vụ !", statusCode: StatusCodes.BAD_REQUEST })
  }

  if ((user_login.accountType != 0 && user_login.accountType != 3) ||
    (user_login.accountType == 3 && service.HosId != hospital_id)
  ) {
    return res.status(401).json({ message: "truy cập không hợp lệ !", statusCode: 401 })
  }

  await Service.findOneAndDelete({ _id: service_id, HosId: hospital_id })
    .then(async () => {
      const { list_service, pageNum, pageSize, total } = await query_list_service(req, hospital_id);
      return res.status(StatusCodes.OK).json({
        data: {
          content: list_service,
          page: pageNum,
          size: pageSize,
          pageSize: list_service?.length,
          totalElement: total,
          total_page: parseInt(list_service?.length / pageSize + 1),
        },
        message: "Xoá dịch vụ thành công.",
        statusCode: 200
      })
    })
    .catch((err) => { return res.status(404).json({ message: err.message, statusCode: 404 }) })

}





