const router = require("express").Router()
const formData = require("express-form-data")
const func = require("../../services/function")
const specialist_hospital_serviece = require("../../controllers/Specialist/Speciallist_hospital")

router.post("/request_add_specialist", func.checkToken, formData.parse(), specialist_hospital_serviece.request_add_sepcial)
router.post("/add_special", func.checkToken, formData.parse(), specialist_hospital_serviece.add_specialist_hospital)
module.exports = router;