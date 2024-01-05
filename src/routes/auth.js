const express = require("express");
const router = express.Router();
const formdata = require("express-form-data");
const Auth = require("../controllers/auth");
const func = require("../services/function");

router.post('/register', formdata.parse(), Auth.Register);
router.post('/login', Auth.login);
router.get('/profile', func.checkToken, Auth.getInfoPerson);
router.post('/forgotPassword', formdata.parse(), func.checkToken, Auth.forgotPassword);
router.post('/decentralization', formdata.parse(), func.checkToken, Auth.decentralization)
router.get('/getInfoPerson/:userId', formdata.parse(), Auth.getInfoPerson) // ohan quyen csyt vaf admin
router.get('/getListAdmin', func.checkToken, Auth.getListAdmin)
router.post('/resetPassword', formdata.parse(), func.checkToken, Auth.resetPassWord)
module.exports = router;