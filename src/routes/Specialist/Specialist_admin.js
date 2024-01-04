const router = require('express').Router();
const formData = require("express-form-data");
const Specialist_service = require("../../controllers/Specialist/Specialist_admin")
const func = require("../../services/function")

router.post('/add_specialist', func.checkToken, formData.parse(), Specialist_service.addSpeciaList_for_admin)
router.post('/update_specialist', func.checkToken, formData.parse(), Specialist_service.updateSpeclist)
router.post('/delete_specialist', func.checkToken, formData.parse(), Specialist_service.deleteSpecialist)
router.get('/list_specialist', func.checkToken, formData.parse(), Specialist_service.getListSpecialist)
module.exports = router;