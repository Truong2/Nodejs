const router = require('express').Router();

const hospital_service = require("../../controllers/Booking");
const func = require("../../services/function");

router.post("/get_list_booking/:hospital_id", hospital_service.get_list_booking_for_hospital_service);

module.exports = router;