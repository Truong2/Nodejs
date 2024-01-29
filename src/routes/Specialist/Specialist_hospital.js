const router = require("express").Router()
const formData = require("express-form-data")
const func = require("../../services/function")
const specialist_hospital_serviece = require("../../controllers/Specialist/Speciallist_hospital")

router.post("/request_add_specialist", func.checkToken, specialist_hospital_serviece.request_add_sepcial)

router.get("/list_specialist/:hos_id", specialist_hospital_serviece.get_list_specialist)

module.exports = router;