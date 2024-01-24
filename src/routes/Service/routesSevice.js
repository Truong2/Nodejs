const router = require('express').Router()
const service_admin_routes = require('./Service_admin')
const service_hospital_routes = require('./Service_hospital')
router.use('/admin/service', service_admin_routes)
router.use('/hospital/service', service_hospital_routes)

module.exports = router