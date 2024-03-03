const Specialist = require("../../models/Specialist")
const func = require("../../services/function");
const User = require("../../models/Users");

exports.request_add_sepcial = async (req, res) => {
  try {
    const {
      speicallist_name
    } = req.body;
    const data = req.user;

    if (data.accountType !== 3) {
      return res.status(404).json({ message: "function is not valid", statusCode: 400 })
    }

    const maxID_Specialist = await func.maxID(Specialist)

    const new_sepciallist = new Specialist({
      _id: maxID_Specialist + 1,
      Specialist_Name: speicallist_name,
      Specialist_statusAccept: 0,
      Specialist_userCreate_id: data._id,
      Specialist_userCreate_accountType: 3
    })
    new_sepciallist.save()
  } catch (err) {
    console.log("err: ", err)
    return res.status(500).json({ message: err.message, statusCode: 500 })
  }

}

exports.get_list_specialist = async (req, res) => {
  const hos_id = Number(req.params.hos_id);
  const id_spec = await User.findOne({ _id: hos_id })
  const list_spec = await Specialist.find({ _id: { $in: id_spec.specialistId } }).select("Specialist_Name")
  return res.status(200).json({
    data: {
      content: list_spec
    },
    message: "sucess",
    statusCode: 200
  })

}

