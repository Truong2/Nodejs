const router = require("express").Router();

const routeRole = require("./RoleUser/routes_role");
const routeSpecialist = require("./Specialist/routes_specialist");
const routesHospital = require("./Hospital/routesHopital");
const auth = require("./auth");
const errorHandlingMiddleware = require("../middlewares/errorHandlingMiddleware");

router.use("/", auth);
router.use("/", routeRole);
router.use("/", routeSpecialist);
router.use("/", routesHospital);

router.use(errorHandlingMiddleware);
module.exports = router;
