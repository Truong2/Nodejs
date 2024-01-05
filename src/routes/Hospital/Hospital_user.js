const router = require("express").Router()
const func = require("../../services/function")
const formData = require("express-form-data")
const hospital_user_service = require("../../controllers/Hospital/Hospital_user")

router.post("/add_specialist", func.checkToken, hospital_user_service.addSpecialist)

module.exports = router;