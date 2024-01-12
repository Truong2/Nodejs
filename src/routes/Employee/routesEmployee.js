const router = require('express').Router()
const employee_routes = require("./Employee")
router.use('/employee', employee_routes)

module.exports = router;