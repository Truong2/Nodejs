const router = require("express").Router()
const formData = require("express-form-data")
const routeRole = require("./RoleUser/routes_role")
const auth = require("./auth")
router.use("/", routeRole)
router.use("/", auth)

module.exports = router;