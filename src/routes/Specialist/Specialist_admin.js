const router = require('express').Router();
const formData = require("express-form-data");
const Specialist_service = require("../../controllers/Specialist/Specialist_admin")
const func = require("../../services/function")

router.post('/add_specialist', func.checkToken, formData.parse(), Specialist_service.addSpeciaList_for_admin)
router.put('/update_specialist', func.checkToken, formData.parse(), Specialist_service.updateSpeclist)
router.delete('/delete_specialist/:id', func.checkToken, formData.parse(), Specialist_service.deleteSpecialist)
router.get('/list_specialist', func.checkToken, Specialist_service.getListSpecialist)
module.exports = router;