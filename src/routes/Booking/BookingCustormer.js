const router = require('express').Router();

const hospital_service = require("../../controllers/Booking")
const func = require("../../services/function")

router.post("/create_booking", func.checkToken, hospital_service.booking_service)


module.exports = router;