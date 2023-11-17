const express = require("express");
const router = express.Router();
const formdata = require("express-form-data");
const Auth = require("../controllers/auth");

router.post('/register', formdata.parse(), Auth.Register);
router.post('/login', formdata.parse(), Auth.login);
module.exports = router;