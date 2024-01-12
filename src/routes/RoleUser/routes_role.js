const router = require("express").Router()
const role_user_routes = require("./RoleUser")
const decentralize_routes = require("./Decentralize")

router.use("/role-user", role_user_routes)
router.use("/decentralize", decentralize_routes)
module.exports = router;