const CalendarWorking = require('../models/CalendarWorking');
const Calendar = require("../models/Calendar")
const { StatusCodes } = require("http-status-codes");
const func = require("../services/function")


exports.booking = async (req, res) => {
  try {
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
        returnres.status(StatusCodes.OK).json({ message: "OK", StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
      })
      .catch((err) => {
        returnres.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
      })



  } catch (err) {
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}