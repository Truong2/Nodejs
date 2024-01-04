const router = require("express").Router()
const specialist_admin_route = require("./Specialist_admin")
const specialist_hospital_route = require("./Specialist_hospital")
router.use('/admin/specialist', specialist_admin_route)
router.use('/hospital/specialist', specialist_hospital_route)

module.exports = router;