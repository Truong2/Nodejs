const router = require("express").Router()
const hospital_admin_routes = require('./Hospital_admin')
const hospital_user_routes = require('./Hospital_user')
router.use("/admin/hospital", hospital_admin_routes)
router.use("/user/hospital", hospital_user_routes)
module.exports = router;
