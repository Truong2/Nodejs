const CalendarWorking = require('../models/CalendarWorking');
const Calendar = require("../models/Calendar")
const { StatusCodes } = require("http-status-codes");
const func = require("../services/function")

exports.booking_service = async (req, res) => {
  try {
    const user_login = req.user.data;
    console.log("user", req)
    const {
      name,
      phone,
      address,
      identification,
      birthday,
      email,
      reason,
      service,
      hospitalId,
      doctorId,
      time
    } = req.body;

    const check_time = await CalendarWorking.exists({ _id: time });
    if (!check_time) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Lịch đặt khám không hợp lệ !", StatusCodes: StatusCodes.BAD_REQUEST })
    }

    const calendar_max_id = await func.maxID(Calendar)

    const new_calendar = new Calendar({
      _id: calendar_max_id + 1,
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
    });

    await new_calendar.save()
      .then(() => {
        return res.status(StatusCodes.OK).json({ message: "OK", StatusCodes: StatusCodes.OK })
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

exports.get_list_booking_for_hospital_service = async (req, res) => {
  try {
    const time_now = Date.now()

    const date_start = req.query.dateStart || 0;
    const date_end = req.query.date_end || time_now;

    const hospital_id = parseInt(req.params.hospital_id);

    list_booking = await Calendar.aggregate([
      {
        $match: {
          hospitalId: hospital_id,
          creatAt: { $gte: date_start },
          creatAt: { $lte: date_end },
        }
      },
      {
        $lookup: {
          from: 'calendars',
          localField: hospitalId,
          foreignField: _id,
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
          localField: doctorId,
          foreignField: _id,
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
          from: 'calendars',
          localField: time,
          foreignField: _id,


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
          hospitalId: { $first: "$hospitalId" },
          hospitalName: { $first: "$Hospital.name" },
          doctorId: { $first: "$doctorId" },
          doctorName: { $first: "$Doctor.name" },
          time: { $first: "$Doctor.name" },

        }
      }
    ])

    return res.status(StatusCodes.OK).json({ message: "SUCESS", data: [], StatusCodes: StatusCodes.OK })

  } catch (err) {
    console.log("Error: ", err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}