const router = require("express").Router()
const formData = require("express-form-data")
const routeRole = require("./RoleUser/routes_role")
const routeSpecialist = require("./Specialist/routes_specialist")
const auth = require("./auth")


router.use("/", auth)
router.use("/", routeRole)
router.use("/", routeSpecialist)

module.exports = router;