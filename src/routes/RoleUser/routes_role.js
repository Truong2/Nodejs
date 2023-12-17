const router = require("express").Router()
const formData = require("express-form-data")
const decentralize_controller = require("../../controllers/Role/Decentralize")
const func = require("../../services/function")
const Roleuser = require("./RoleUser")
const Decentralize = require("./Decentralize")

router.use("/role-user", Roleuser)
router.use("/decentralize", Decentralize)
module.exports = router;