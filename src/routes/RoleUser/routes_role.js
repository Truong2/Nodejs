const router = require("express").Router()
const Roleuser = require("./RoleUser")
const Decentralize = require("./Decentralize")

router.use("/role-user", Roleuser)
router.use("/decentralize", Decentralize)
module.exports = router;