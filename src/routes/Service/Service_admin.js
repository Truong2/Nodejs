const router = require('express').Router()
const func = require('../../services/function')
const service_service = require("../../controllers/Service/Service_admin")

router.post('/create-service', func.checkToken, service_service.create_service)
router.get('/get-list-service', func.checkToken, service_service.get_list_sevice_service)

module.exports = router