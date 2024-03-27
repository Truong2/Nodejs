const CalendarWorking = require('../models/CalendarWorking');
const Calendar = require("../models/Calendar")
const { StatusCodes } = require("http-status-codes");
const func = require("../services/function")
const { STATUS_BOOKING } = require('../config/config')

const query_list_booking_for_customer = async (req) => {
  const time_now = Date.now()
  const user_login = req.user.data._id;

  const date_start = req.query.dateStart || 0;
  const date_end = req.query.date_end || time_now;
  const status = req.query.status;

  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;

  const condition = {}
  if (status) {
    condition.status = status
  }

  list_booking = await Calendar.aggregate([
    {
      $match: {
        $and: [
          { user_create: user_login },
          { createAt: { $gte: date_start } },
          { createAt: { $lte: date_end } }
        ]
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: "hospitalId",
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
        from: 'calendars',
        localField: "doctorId",
        foreignField: "_id",
        as: "Doctor"
      }
    },
    {
      $unwind: {
        path: "$Doctor",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'timeworkings',
        localField: "time",
        foreignField: "_id",
        as: 'Timeworkings'
      }
    },
    {

      $unwind: {
        path: "$Timeworkings",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'services',
        localField: "serviceId",
        foreignField: "_id",
        as: 'Services'
      }
    },
    {

      $unwind: {
        path: "$Services",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      "$group": {
        _id: "$_id",
        patientName: { $first: "$name" },
        patientId: { $first: "$identification" },
        patientPhoneNumber: { $first: "$phoneNumber" },
        patientBirthday: { $first: "$birthday" },
        patientemail: { $first: "$email" },
        patientAdress: { $first: "$adress" },
        reason: { $first: "$reason" },
        serviceId: { $first: "$serviceId" },
        serviceName: { $first: "$Services.serviceName" },
        hospitalId: { $first: "$hospitalId" },
        hospitalName: { $first: "$Hospital.name" },
        doctorId: { $first: "$doctorId" },
        doctorName: { $first: "$Doctor.name" },
        time: { $first: "$Timeworkings.time_working" },
        status: { $first: "$status" }
      }
    },
    {
      $skip: Number(pageSize * (page - 1)),
    },
    {
      $limit: Number(pageSize)
    },
    {
      $sort: {
        createAt: -1
      }
    }
  ])

  total = await Calendar.find({
    $and: [
      { user_create: user_login },
      { createAt: { $gte: date_start } },
      { createAt: { $lte: date_end } }
    ]
  }).count()

  return { list_booking, page, pageSize, total }
}

const query_list_booking_for_hospital = async (req) => {
  const time_now = Date.now()

  const date_start = req.query.dateStart || 0;
  const date_end = req.query.date_end || time_now;
  const status = req.query.status;
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;

  const condition = {}
  if (status) {
    condition.status = status
  }

  const hospital_id = parseInt(req.params.hospital_id);

  list_booking = await Calendar.aggregate([
    {
      $match: {
        $and: [
          { hospitalId: hospital_id },
          { createAt: { $gte: date_start } },
          { createAt: { $lte: date_end } },
          condition
        ]
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: "hospitalId",
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
        from: 'calendars',
        localField: "doctorId",
        foreignField: "_id",
        as: "Doctor"
      }
    },
    {
      $unwind: {
        path: "$Doctor",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'timeworkings',
        localField: "time",
        foreignField: "_id",
        as: 'Timeworkings'
      }
    },
    {

      $unwind: {
        path: "$Timeworkings",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'services',
        localField: "serviceId",
        foreignField: "_id",
        as: 'Services'
      }
    },
    {

      $unwind: {
        path: "$Services",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      "$group": {
        _id: "$_id",
        patientName: { $first: "$name" },
        patientId: { $first: "$identification" },
        patientPhoneNumber: { $first: "$phoneNumber" },
        patientBirthday: { $first: "$birthday" },
        patientemail: { $first: "$email" },
        patientAdress: { $first: "$adress" },
        reason: { $first: "$reason" },
        serviceId: { $first: "$serviceId" },
        serviceName: { $first: "$Services.serviceName" },
        hospitalId: { $first: "$hospitalId" },
        hospitalName: { $first: "$Hospital.name" },
        doctorId: { $first: "$doctorId" },
        doctorName: { $first: "$Doctor.name" },
        time: { $first: "$Timeworkings.time_working" },
        createAt: { $first: "$createAt" },
        status: { $first: "$status" }
      }
    },
    {
      $skip: Number(pageSize * (page - 1)),
    },
    {
      $limit: Number(pageSize)
    },
    {
      $sort: {
        createAt: -1
      }
    }
  ])

  total = await Calendar.find({
    $and: [
      { hospitalId: hospital_id },
      { createAt: { $gte: date_start } },
      { createAt: { $lte: date_end } },
      condition
    ]
  }).count()
  return { list_booking, page, pageSize, total }
}

exports.booking_service = async (req, res) => {
  try {
    const user_login = req.user.data._id;
    const time_now = Date.now()

    const {
      name,
      phone,
      address,
      day,
      identification,
      birthday,
      email,
      reason,
      service,
      hospitalId,
      doctorId,
      time
    } = req.body;

    if (doctorId) {
      const check_time = await CalendarWorking.exists({ time_working: { $in: time }, userId: doctorId, hospitalId: hospitalId });
      if (!check_time) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Lịch đặt khám không hợp lệ !", StatusCodes: StatusCodes.BAD_REQUEST })
      }
    }


    const calendar_max_id = await func.maxID(Calendar)
    const new_calendar = new Calendar({
      _id: calendar_max_id + 1,
      user_create: user_login,
      name: name,
      identification: identification,
      phoneNumber: phone,
      birthday: birthday,
      email: email,
      adress: address,
      reason: reason,
      serviceId: service,
      hospitalId: hospitalId,
      doctorId: doctorId,
      time: time,
      day: func.getFirstSecondOfDay(day),
      status: STATUS_BOOKING['PENDING'],
      createAt: parseInt(time_now)
    });

    await new_calendar.save()
      .then(async () => {

        /************************************************************** 
                              Call WebSocket
        **************************************************************/

        const { list_booking, page, pageSize, total } = await query_list_booking_for_customer(req)
        return res.status(StatusCodes.OK)
          .json({
            data: {
              content: list_booking,
              page: page,
              size: pageSize,
              pagesize: list_booking.length,
              totalElement: total,
              total_page: parseInt(total / pageSize + 1),
            },
            statusCode: 200,
            message: "Đặt lịch khám thành công."
          })
      })

      .catch((err) => {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
      })
    return
  } catch (err) {
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}

exports.get_list_booking_for_customer_service = async (req, res) => {
  try {

    const { list_booking, page, pageSize, total } = await query_list_booking_for_customer(req)

    return res.status(StatusCodes.OK)
      .json({
        data: {
          content: list_booking,
          page: page,
          size: pageSize,
          pagesize: list_booking.length,
          totalElement: total,
          total_page: parseInt(total / pageSize + 1),
        },
        statusCode: 200,
        message: "success"
      })


  } catch (err) {
    console.log("Error: ", err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}

exports.get_list_booking_for_hospital_service = async (req, res) => {
  try {
    const { list_booking, page, pageSize, total } = await query_list_booking_for_hospital(req)

    return res.status(StatusCodes.OK)
      .json({
        data: {
          content: list_booking,
          page: page,
          size: pageSize,
          pagesize: list_booking.length,
          totalElement: total,
          total_page: parseInt(total / pageSize + 1),
        },
        statusCode: 200,
        message: "success"
      })



  } catch (err) {
    console.log("Error: ", err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}

exports.handle_booking_service_for_hospital = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const status = req.params.status;

    const user_login = req.user.data._id;

    const booking = await Calendar.findOne({ _id: parseInt(bookingId) })
    if (!booking) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không tìm thấy lịch khám !", StatusCodes: StatusCodes.BAD_REQUEST })
    }

    if (booking.status != STATUS_BOOKING['PENDING']) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bạn đã xử lý lịch khám này trước đó !", StatusCodes: StatusCodes.BAD_REQUEST })
    }

    if (booking.hospitalId != user_login) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Truy cập không hợp lệ !", StatusCodes: StatusCodes.UNAUTHORIZED })
    }

    await Calendar.findOneAndUpdate({
      _id: parseInt(bookingId)
    }, {
      status: status
    })
      .then(async () => {

        /**************************************************************
                                Call WebSocket
        **************************************************************/

        const { list_booking, page, pageSize, total } = await query_list_booking_for_customer(req)
        return res.status(StatusCodes.OK)
          .json({
            data: {
              content: list_booking,
              page: page,
              size: pageSize,
              pagesize: list_booking.length,
              totalElement: total,
              total_page: parseInt(total / pageSize + 1),
            },
            statusCode: 200,
            message: "Xử lý lịch khám thành công."
          })
      })

      .catch((err) => {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
      })

  } catch (err) {
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}

exports.cancel_booking_service_for_customer = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const user_login = req.user.data._id;

    const booking = await Calendar.findOne({ _id: parseInt(bookingId) })
    if (!booking) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không tìm thấy lịch khám !", StatusCodes: StatusCodes.BAD_REQUEST })
    }
    if (user_login != booking.user_create) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Truy cập không hợp lệ !", StatusCodes: StatusCodes.UNAUTHORIZED })
    }

    await Calendar.findOneAndUpdate({
      _id: parseInt(bookingId)
    }, {
      status: STATUS_BOOKING['CANCEL']
    })
      .then(async () => {

        /**************************************************************
                              Call WebSocket
        **************************************************************/

        const { list_booking, page, pageSize, total } = await query_list_booking_for_customer(req)
        return res.status(StatusCodes.OK)
          .json({
            data: {
              content: list_booking,
              page: page,
              size: pageSize,
              pagesize: list_booking.length,
              totalElement: total,
              total_page: parseInt(total / pageSize + 1),
            },
            statusCode: 200,
            message: "Xử lý lịch khám thành công."
          })
      })


  } catch (err) {
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}