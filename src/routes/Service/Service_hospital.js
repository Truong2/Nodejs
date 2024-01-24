const router = require('express').Router()
const func = require('../../services/function')
const service_service = require("../../controllers/Service/Service_hospital")

router.post('/add-service/:hospital_id', func.checkToken, service_service.add_service_service)
router.get('/detail-service/:service_id', func.checkToken, service_service.detail_service_service)
router.get('/get-list-service/:hospital_id', func.checkToken, service_service.get_list_service_service)
router.put('/update-service/:hospital_id', func.checkToken, service_service.update_service_service)

module.exports = router;

