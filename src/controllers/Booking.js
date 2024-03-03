const Calendar = require('../models/CalendarWorking');
const { StatusCodes } = require("http-status-codes");


exports.booking = async (req, res) => {
  try {
    const {
      userName,
      userPhone,
      useAddress,
      
    } = req.body;

  } catch (err) {
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}