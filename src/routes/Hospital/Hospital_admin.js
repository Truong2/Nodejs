const router = require('express').Router();
const formData = require("express-form-data");
const hospital_service = require("../../controllers/Hospital/Hospital_admin")
const func = require("../../services/function")



router.get('/get_list_hospital', func.checkToken, formData.parse(), hospital_service.getListHospital)
router.post('/update_hospital', func.checkToken, formData.parse(), hospital_service.editHospital)
router.post('/grant_role_hospital', func.checkToken, formData.parse(), hospital_service.grantRoleHospital)
router.post('/change_status_hospital', func.checkToken, formData.parse(), hospital_service.changeStatus)
router.post('/delete_hospital', func.checkToken, formData.parse(), hospital_service.deleteHospital)
module.exports = router;