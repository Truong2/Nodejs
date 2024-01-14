const router = require("express").Router();

const errorHandlingMiddleware = require("../middlewares/errorHandlingMiddleware");

const routeRole = require("./RoleUser/routes_role");
const routeSpecialist = require("./Specialist/routes_specialist");
const routesHospital = require("./Hospital/routesHopital");
const routesEmployee = require("./Employee/routesEmployee")
const routesSevice = require('./Service/routesSevice')
const auth = require("./auth");


router.use("/", auth);
router.use("/", routeRole);
router.use("/", routeSpecialist);
router.use("/", routesHospital);
router.use("/", routesEmployee);
router.use("/", routesSevice);


router.use(errorHandlingMiddleware);
module.exports = router;
