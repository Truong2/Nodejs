const TypeService = require('../../models/TypeService')
const Service = require('../../models/Service')
const User = require('../../models/Users')
const func = require('../../services/function')
const { StatusCodes } = require('http-status-codes')

const get_list_service = async (req) => {
  let serviceName = req.query.serviceName || "";
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.pageNum || 1;

  const list_service = await TypeService.aggregate([
    {
      $match: {
        serviceName: { $regex: serviceName }
      }
    },
    {
      $lookup: {
        from: "admins",
        localField: 'userCreate',
        foreignField: '_id',
        as: "usercreate"
      }
    },
    {
      $unwind: {
        path: "$usercreate",
        preserveNullAndEmptyArrays: true
      },
    },
    {
      $group: {
        _id: "$_id",
        serviceCode: { $first: "$serviceCode" },
        serviceName: { $first: "$serviceName" },
        createAt: { $first: "$createAt" },
        userCreate: { $first: "$usercreate.Admin_name" },
        status: { $first: "$status" },
      }
    }
  ]
  )
    .skip(Number(pageSize * (pageNum - 1)))
    .limit(Number(pageSize))

  const total = await TypeService.find().count()

  return { list_service, pageSize, pageNum, total }
}

exports.create_service = async (req, res) => {
  let { serviceName, serviceCode } = req.body;
  const user_login = req.user.data;

  if (!serviceName) {
    return res.status(400).json({ message: "Bad request !", statusCode: 400 })
  }

  serviceCode = serviceCode.trim()
  const check_exist_code = await TypeService.find({ serviceCode: serviceCode })
  if (!check_exist_code) {
    return res.status(400).json({ message: "Mã dịch vụ đã tồn tại !", statusCode: 400 })
  }

  if (user_login.accountType !== 0) {
    return res.status(400).json({ message: "Truy cập không hợp lệ !", statusCode: 401 })
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
          message: "Tạo dịch vụ thành công.",
          statusCode: 200
        })
    })
    .catch(async (err) => {
      return res.status(500)
        .json({
          message: err.message,
          statusCode: 500
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

exports.listSevice = async (req, res) => {
  const serviceName = req.query.serviceName || "";
  const pageSize = req.query.pageSize || 10;
  const pageNum = req.query.pageNum || 1;
  const hos_id = Number(req.query.hos_id);
  const condition = {}
  if (hos_id && isNaN(hos_id)) {
    return res.status(400).json({
      message: "Bad request !",
      statusCode: 400
    })
  } else if (hos_id != 0) {
    condition.HosId = hos_id
  }

  const list_service = await Service.find({
    $and: [
      { serviceName: { $regex: serviceName } },
      condition
    ]
  })
    .select("serviceName HosId")
    .skip(Number(pageSize * (pageNum - 1)))
    .limit(Number(pageSize))

  const total = await Service.find({
    $and: [
      { serviceName: { $regex: serviceName } },
      condition
    ]
  }).count()

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
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bad request !", statusCode: StatusCodes.UNAUTHORIZED })
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

exports.get_list_service_by_type_service = async (req, res) => {
  const serviceName = req.query.serviceName || "";
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.pageNum || 1;

  const typeService_id = Number(req.query.typeService_id);
  const specialist = Number(req.query.specialist);

  // if (!typeService_id && !specialist) {
  //   return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request !", statusCode: StatusCodes.BAD_REQUEST })
  // }
  const condition1 = {}

  if (typeService_id) {
    condition1.type_service = { $in: [typeService_id] }
  }
  const condition2 = {}
  if (specialist) {
    condition2.SpecialistId = { $in: [specialist] }
  }
  const list_service = await Service.aggregate([
    {
      $match: {
        $and: [
          { serviceName: { $regex: serviceName } },
          {
            $or: [
              condition1,
              condition2
            ]
          }
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
      $group: {
        _id: "$_id",
        name: { $first: "$serviceName" },
        cost: { $first: "$serviceCost" },
        user_number: { $first: "$service_userUsed" },
        hospital: { $first: "$Hospital.name" },
        specialist: { $addToSet: "$Specialist.Specialist_Name" },
        serviceType: { $addToSet: "$SeviceType.serviceName" },
        status: { $first: "$status" }
      }
    },
    {
      $sort: {
        name: 1
      }
    }
  ])
  const total = await Service.find({
    $and: [
      { serviceName: { $regex: serviceName } },
      {
        $or: [
          { SpecialistId: { $in: [specialist] } },
          { type_service: { $in: [typeService_id] } }
        ]
      }
    ]

  }).count()

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

exports.get_all_service = async (req, res) => {

}