const router = require('express').Router();

const hospital_service = require("../../controllers/Booking");
const func = require("../../services/function");

router.get("/get_list_booking/:hospital_id", hospital_service.get_list_booking_for_hospital_service);

router.put("/handle_booking/:bookingId/:status", hospital_service.handle_booking_service_for_hospital);

module.exports = router;