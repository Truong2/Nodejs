const express = require("express");
const router = express.Router();
const formdata = require("express-form-data");
const Auth = require("../controllers/auth");
const func = require("../services/function");

router.post('/register', Auth.Register);
router.put('/update-profile/:user_id', func.checkToken, Auth.editProfile);
router.post('/login', Auth.login);
router.get('/profile', func.checkToken, Auth.InfoPerson);
router.get('/getInfoPerson/:userId', Auth.getInfoPerson)
router.get('/getListAdmin', func.checkToken, Auth.getListAdmin)
router.get('/get-list-hospital', func.checkToken, Auth.getListHospital)
router.get('/get-list-employee', func.checkToken, Auth.getListEmployee)
router.post('/add-avatar/:user_id', formdata.parse(), func.checkToken, Auth.add_avatar_service)
router.get('/get-avatar/:user_id', Auth.get_avatar_service)
router.put('/update-password/:user_id', func.checkToken, Auth.update_password_service)
router.post('/get-opt', Auth.get_otp_service)
module.exports = router;