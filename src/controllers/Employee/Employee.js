const TimeWorking = require("../../models/TimeWorking")
const CalendarWorking = require("../../models/CalendarWorking")
const func = require("../../services/function")
const { StatusCodes } = require("http-status-codes");
const dayjs = require('dayjs')

exports.create_time_working_service = async (req, res) => {
  let { time } = req.body;

  const max_id_timeWorking = await func.maxID(TimeWorking)

  const new_time_working = new TimeWorking({
    _id: max_id_timeWorking + 1,
    time_working: time
  })
  await new_time_working.save()
    .then(() => {
      return res.status(StatusCodes.OK).json({ message: "success", statusCode: 200 })
    })
    .catch(err => {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "create fail", statusCode: StatusCodes.UNPROCESSABLE_ENTITY })
    })
}

exports.get_list_time_working_service = async (req, res) => {
  const list_time_working = await TimeWorking.find()

  return res.status(StatusCodes.OK)
    .json({
      data: {
        content: list_time_working,
        total_record: list_time_working.length,
      },
      message: "success", statusCode: 200
    })
}

exports.create_calendar_working_serviece = async (req, res) => {
  const {
    date,
    time_working
  } = req.body;
  const user_login = req.user.data;

  if (user_login.accountType !== 1) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "fucntion is not valid", statusCode: StatusCodes.UNAUTHORIZED })
  }

  if (isNaN(date) || date <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "date is not valid ", statusCode: StatusCodes.BAD_REQUEST })
  }
  //2024-01-11T21:44:17.597Z

  const check_time_working = await TimeWorking.find({ _id: { $in: time_working.map(Number) } })
  if (check_time_working.length !== time_working.length) {
    return res.status(StatusCodes.PRECONDITION_FAILED).json({ message: "time working is not valid", statusCode: StatusCodes.PRECONDITION_FAILED })
  }

  const time = dayjs(new Date(date)).startOf('D').unix() * 1000;
  console.log(new Date(time))
  // console.log(new Date(time).getDate())
  // console.log(new Date())
  const old_schedule = await CalendarWorking.findOne({
    userId: user_login._id,
    hospitalId: user_login.hospital_id,
    date: time,
  })

  if (old_schedule) {
    await CalendarWorking.findOneAndUpdate({
      userId: user_login._id,
      hospitalId: user_login.hospital_id,
      date: time,
    }, {
      time_working: time_working
    })
      .then(() => {
        return res.status(StatusCodes.OK).json({ message: "create new time working success", statusCode: 200 })
      })
      .catch(err => {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "create fail", statusCode: StatusCodes.UNPROCESSABLE_ENTITY })
      })

  } else {
    const max_id_shedule = await func.maxID(CalendarWorking)

    const new_schedule = new CalendarWorking({
      _id: max_id_shedule + 1,
      userId: user_login._id,
      hospitalId: user_login.hospital_id,
      date: time,
      time_working: time_working
    })

    await new_schedule.save()
      .then(() => {
        return res.status(StatusCodes.OK).json({ message: "create new time working success", statusCode: 200 })
      })
      .catch(err => {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "create fail", statusCode: StatusCodes.UNPROCESSABLE_ENTITY })
      })
  }
}

exports.get_list_calendar_working_serviece = async (req, res) => {
  const time = req.params.time;
  const filter_time = dayjs(new Date(time * 1000)).startOf('D').unix();
  console.log(filter_time)

  const user_login = req.user.data;

  if (user_login.accountType !== 1) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "fucntion is not valid", statusCode: StatusCodes.UNAUTHORIZED })
  }

  const list_calendar = await CalendarWorking.aggregate([
    {
      $match: {
        $and: [
          { date: { $gte: filter_time * 1000 } },
          { userId: user_login._id },
          { hospitalId: user_login.hospital_id }
        ]
      }
    },
    {
      $lookup: {
        from: 'timeworkings',
        localField: "time_working",
        foreignField: "_id",
        as: "TimeWorking"
      }
    },
    {
      $unwind: {
        path: "$TimeWorking",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        date: { $first: "$date" },
        TimeWorking: { $addToSet: "$TimeWorking.time_working" }
      }
    },
    {
      $limit: 7
    }, {
      $sort: {
        date: 1
      }
    }
  ]
  )

  return res.status(StatusCodes.OK)
    .json({
      data: {
        content: list_calendar,
        total_record: list_calendar.length,

      },
      message: "success", statusCode: 200
    })
}
