const router = require("express").Router()
const hospital_admin_routes = require('./Hospital_admin')
router.use("/admin/hospital", hospital_admin_routes)
module.exports = router;
