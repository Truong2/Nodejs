const router = require("express").Router()
const formData = require("express-form-data")
const roleUser_controller = require("../../controllers/Role/RoleUser")
const func = require("../../services/function")

router.post("/create-role-user", func.checkToken, roleUser_controller.createRoleUser)
router.put("/update-role-user", func.checkToken, roleUser_controller.EditRleUser)
router.delete("/delete-role-user", func.checkToken, roleUser_controller.deleteRoleUser)
router.get("/get-list-role-user", formData.parse(), func.checkToken, roleUser_controller.getListRoleUser)
router.get("/get-list-role-user-child/:id", formData.parse(), func.checkToken, roleUser_controller.getListRoleUserChild)
module.exports = router;