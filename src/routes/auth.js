const express = require("express");
const router = express.Router();
const formdata = require("express-form-data");
const Auth = require("../controllers/auth");
const func = require("../services/function");

router.post('/register', Auth.Register);
router.post('/update-profile/:user_id', formdata.parse(), func.checkToken, Auth.editProfile);
router.post('/login', Auth.login);
router.get('/profile', func.checkToken, Auth.InfoPerson);
router.get('/getInfoPerson/:userId', Auth.getInfoPerson)
router.get('/getListAdmin', func.checkToken, Auth.getListAdmin)
router.get('/get-list-hospital', func.checkToken, Auth.getListHospital)
router.get('/get-list-employee', func.checkToken, Auth.getListEmployee)

router.post('/upoad_file', formdata.parse(), Auth.upload)

module.exports = router;