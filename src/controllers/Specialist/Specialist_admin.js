const Specialist = require("../../models/Specialist");
const func = require("../../services/function");
exports.addSpeciaList_for_admin = async (req, res) => {
  try {
    const { name } = req.body;
    const { data } = req.user;

    if (data.accountType != 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    const maxId_Specialist = await func.maxID(Specialist);
    const new_specialist = new Specialist({
      _id: maxId_Specialist + 1,
      Specialist_Name: name,
      Specialist_userCreate_id: data._id,
    });
    await new_specialist
      .save()
      .then(() => {
        return res.status(200).json({ message: "add specialist success", statusCode: 200 });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message, statusCode: 500 });
      });
  } catch (err) {
    console.log("err: ", err.message);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.updateSpeclist = async (req, res) => {
  try {
    const { name, specialist_id, status } = req.body;
    const { data } = req.user;

    if (data.accountType != 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    const check_exists = await Specialist.exists({ _id: specialist_id });
    if (!check_exists) {
      return res.status(400).json({ message: "specialist_id is not valid", statusCode: 400 });
    }

    await Specialist.findOneAndUpdate(
      {
        _id: specialist_id,
      },
      {
        Specialist_Name: name,
        Specialist_statusAccept: status,
      }
    )
      .then(() => {
        return res.status(200).json({ message: "update specialist success", statusCode: 200 });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message, statusCode: 500 });
      });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.deleteSpecialist = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.user;

    if (data.accountType != 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    const check_exists = await Specialist.exists({ _id: Number(id) });
    if (!check_exists) {
      return res.status(400).json({ message: "specialist_id is not valid", statusCode: 400 });
    }

    await Specialist.findOneAndDelete({ _id: id }).then(() => {
      return res.status(200).json({ message: "delete sucess", statusCode: 200 });
    });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.getListSpecialist = async (req, res) => {
  try {
    // const { data } = req.user;
    const { name } = req.query;

    // if (data.accountType != 0 && data.accountType != 3) {
    //   return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    // }
    const regexName = new RegExp(name || "", "i");

    const list_specialist = await Specialist.find({
      Specialist_Name: { $regex: regexName },
    })
      .then((list) => {
        return res
          .status(200)
          .json({ message: "get specialist success", data: list });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message, statusCode: 500 });
      });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};
