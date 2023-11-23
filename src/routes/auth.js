const express = require("express");
const router = express.Router();
const formdata = require("express-form-data");
const Auth = require("../controllers/auth");
const func = require("../services/function");

router.post('/register', formdata.parse(), Auth.Register);
router.post('/login', formdata.parse(), Auth.login);
router.post('/info_person', formdata.parse(), func.checkToken, Auth.getInfoPerson);
router.post('/forgotPassword', formdata.parse(), func.checkToken, Auth.forgotPassword);
router.post('/decentralization', formdata.parse(), func.checkToken, Auth.decentralization)
module.exports = router;