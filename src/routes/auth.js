const express = require("express");
const router = express.Router();
const formdata = require("express-form-data");
const Auth = require("../controllers/auth");
const func = require("../services/function");

router.post('/register', formdata.parse(), Auth.Register);
router.post('/login', Auth.login);
router.get('/profile', func.checkToken, Auth.InfoPerson);
router.get('/getInfoPerson/:userId/:typeAcc', Auth.getInfoPerson)
router.get('/getListAdmin', func.checkToken, Auth.getListAdmin)
router.get('/get-list-hospital', func.checkToken, Auth.getListHospital)
router.get('/get-list-employee', func.checkToken, Auth.getListEmployee)

module.exports = router;