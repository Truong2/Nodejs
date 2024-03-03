const router = require("express").Router();
const employee_serviece = require('../../controllers/Employee/Employee')
const func = require('../../services/function');

router.post('/create-calendar-working', func.checkToken, employee_serviece.create_calendar_working_serviece)
router.put('/update-calendar-working/:time_id', employee_serviece.update_time_working_service)
router.get('/get-list-calendar-working/:time', func.checkToken, employee_serviece.get_list_calendar_working_serviece)



router.post('/create-time-working', employee_serviece.create_time_working_service)
router.get('/get-list-time-working', employee_serviece.get_list_time_working_service)

module.exports = router;
