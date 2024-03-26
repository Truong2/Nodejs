const router = require('express').Router()

const employee_routes = require("./BookingCustormer")
const hospital_routes = require("./BookingHospital")

router.use('/booking_customer', employee_routes)
router.use('/booking_hospital', hospital_routes)

module.exports = router;