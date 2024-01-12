const router = require('express').Router()
const service_admin_routes = require('./Service_admin')

router.use('/admin/service', service_admin_routes)

module.exports = router