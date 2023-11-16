const express = require("express");
const router = express.Router();
const formdata = require("express-form-data");
const Auth = require("../controllers/auth");

router.post('/register', formdata.parse(), Auth.Register);

module.exports = router;