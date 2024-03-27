const router = require('express').Router();

const hospital_service = require("../../controllers/Booking")
const func = require("../../services/function")

router.post("/create_booking", func.checkToken, hospital_service.booking_service)
router.get("/get_list_booking", func.checkToken, hospital_service.get_list_booking_for_customer_service)
router.put("/cancel_booking/:bookingId", func.checkToken, hospital_service.cancel_booking_service_for_customer)

module.exports = router;