const Specialist = require("../../models/Specialist");
const func = require("../../services/function")
exports.addSpeciaList_for_admin = async (req, res) => {
  try {
    const { name } = req.body;
    const { data } = req.user;

    if (data.accountType != 0) {
      return res.status(400).json({ message: "function is not valid" })
    }

    const maxId_Specialist = await func.maxID(Specialist)
    const new_specialist = new Specialist({
      _id: maxId_Specialist + 1,
      Specialist_Name: name,
      Specialist_userCreate_id: data._id,
      Specialist_userCreate_name: data.name,
      Specialist_userCreate_accountType: data.accountType
    })
    await new_specialist.save()
      .then(() => { return res.status(200).json({ message: "add specialist success" }) })
      .catch((err) => { return res.status(500).json({ message: err.message }) })

  } catch (err) {
    console.log("err: ", err.message)
    return res.status(500).json({ message: err.message })
  }
}

exports.updateSpeclist = async (req, res) => {
  try {

    const { name, specialist_id, status } = req.body;
    const { data } = req.user;

    if (data.accountType != 0) {
      return res.status(400).json({ message: "function is not valid" })
    }

    const check_exists = await Specialist.exists({ _id: specialist_id });
    if (!check_exists) {
      return res.status(400).json({ message: "specialist_id is not valid" })
    }

    await Specialist.findOneAndUpdate(
      {
        _id: specialist_id
      },
      {
        Specialist_Name: name,
        Specialist_statusAccept: status
      }
    )
      .then(() => { return res.status(200).json({ message: "update specialist success" }) })
      .catch((err) => { return res.status(500).json({ message: err.message }) })

    return res.status(200).json({ message: "Ok" })

  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err.message })
  }
}

exports.deleteSpecialist = async (req, res) => {
  try {
    const { id } = req.body;
    const { data } = req.user;

    if (data.accountType != 0) {
      return res.status(400).json({ message: "function is not valid" })
    }

    const check_exists = await Specialist.exists({ _id: id });
    if (!check_exists) {
      return res.status(400).json({ message: "specialist_id is not valid" })
    }

    await Specialist.findOneAndDelete({ _id: id })



  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err.message })
  }
}

exports.getListSpecialist = async (req, res) => {
  try {
    const { data } = req.user;

    if (data.accountType != 0) {
      return res.status(400).json({ message: "function is not valid" })
    }
    const list_specialist = await Specialist.find()
      .then((list) => { return res.status(200).json({ message: "get specialist success", data: list }) })
      .catch((err) => { return res.status(500).json({ message: err.message }) })

  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err.message })
  }

}



