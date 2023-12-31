const router = require("express").Router()
const formData = require("express-form-data")
const decentralize_service = require("../../controllers/Role/Decentralize")
const func = require("../../services/function")
router.post("/create-decentralize", func.checkToken, decentralize_service.createRole)
router.put("/update-decentralize", func.checkToken, decentralize_service.updateDecentralize)
router.delete("/delete-decentralize/:decentralize_id", func.checkToken, decentralize_service.deletedentralize)
router.get("/list-decentralize", func.checkToken, decentralize_service.listDecentralize)
router.get("/detail-decentralize/:decentralize_id", func.checkToken, decentralize_service.detailDecentralizes)
module.exports = router;