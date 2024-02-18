const router = require('express').Router();
const formData = require("express-form-data");
const hospital_service = require("../../controllers/Hospital/Hospital_admin")
const func = require("../../services/function")

router.get('/get_list_hospital', hospital_service.getListHospital)
router.put('/update_hospital', func.checkToken, hospital_service.editHospital)
router.put('/grant_role_hospital', func.checkToken,  hospital_service.grantRoleHospital)
router.put('/change_status_hospital', func.checkToken,  hospital_service.changeStatus)
router.post('/delete_hospital', func.checkToken,hospital_service.deleteHospital)

router.get('/list-hospital', hospital_service.list_hospital)
module.exports = router;