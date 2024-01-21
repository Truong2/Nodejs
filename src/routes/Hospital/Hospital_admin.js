const router = require('express').Router();
const formData = require("express-form-data");
const hospital_service = require("../../controllers/Hospital/Hospital_admin")
const func = require("../../services/function")



router.get('/get_list_hospital', func.checkToken, formData.parse(), hospital_service.getListHospital)
router.put('/update_hospital', func.checkToken, formData.parse(), hospital_service.editHospital)
router.put('/grant_role_hospital', func.checkToken, formData.parse(), hospital_service.grantRoleHospital)
router.put('/change_status_hospital', func.checkToken, formData.parse(), hospital_service.changeStatus)
router.delete('/delete_hospital', func.checkToken, formData.parse(), hospital_service.deleteHospital)
module.exports = router;