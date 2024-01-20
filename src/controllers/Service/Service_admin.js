const TypeService = require('../../models/TypeService')
const func = require('../../services/function')
const { StatusCodes } = require('http-status-codes')


const get_list_service = async (name, page, pageSize) => {
  const list_service = await TypeService.find(
    {
      serviceName: { $regex: name }
    })
    .skip(Number(pageSize * (page - 1)))
    .limit(Number(pageSize))

  return list_service
}

exports.create_service = async (req, res) => {
  const { serviceName } = req.body;
  const user_login = req.user.data;

  if (!serviceName) {
    return res.status(400).json({ message: "input is not valid", statusCode: 400 })
  }

  if (user_login.accountType !== 0) {
    return res.status(400).json({ message: "Function is not valid", statusCode: 400 })
  }

  const maxId_service = await func.maxID(TypeService)
  const new_type_service = new TypeService({
    _id: maxId_service + 1,
    serviceName: serviceName,
    createAt: new Date(),
    userCreate: user_login._id,
    AcceptAt: new Date(),
    userAccept: user_login._id,
  })

  await new_type_service.save()
    .then(async () => {
      const list_service = await get_list_service("", 1, 20)
      return res.status(StatusCodes.OK)
        .json({
          data: {
            content: list_service,
            total_record: list_service.length,
          },
          message: "create service success", statusCode: 200
        })
    })
    .catch(async (err) => {
      const list_service = await get_list_service("", 1, 20)
      return res.status(400)
        .json({
          data: {
            content: list_service,
            total_record: list_service.length,
          },
          message: "create fail", statusCode: 400
        })
    })
}

exports.get_list_sevice_service = async (req, res) => {
  let serviceName = req.query.serviceName || "";
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  const list_service = await get_list_service(serviceName, page, pageSize)

  return res.status(StatusCodes.OK)
    .json({
      data: {
        content: list_service,
        page: page,
        size: pageSize,
        total_record: list_service.length,
        total_page: parseInt(list_service.length / pageSize + 1),
      },
      message: "success", statusCode: 200
    })
}