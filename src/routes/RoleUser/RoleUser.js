const router = require("express").Router()
const formData = require("express-form-data")
const roleUser_controller = require("../../controllers/Role/RoleUser")
const func = require("../../services/function")

router.post("/create-role-user", roleUser_controller.createRoleUser)
router.put("/update-role-user/:id", roleUser_controller.EditRoleUser)
router.delete("/delete-role-user/:id", roleUser_controller.deleteRoleUser)
router.get("/get-list-role-user", func.checkToken, roleUser_controller.getListRoleUser)
router.get("/get-list-role-user-child/:id", func.checkToken, roleUser_controller.getListRoleUserChild)
module.exports = router;