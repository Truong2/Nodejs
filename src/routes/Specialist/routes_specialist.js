const router = require("express").Router()
const specialist_route = require("./Specialist")

router.use('/specialist', specialist_route)

module.exports = router;