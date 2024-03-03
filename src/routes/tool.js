const express = require("express");
const router = express.Router();
const tool = require("../controllers/tools")

router.get("/tool/", tool.province_service)

module.exports = router;
