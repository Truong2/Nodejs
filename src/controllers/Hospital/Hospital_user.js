const Decentralize = require('../../models/decentralize')
const Hospital = require("../../models/Hospital")
const Specialist = require("../../models/Specialist")
exports.addSpecialist = async (req, res) => {
  try {
    let { specialist } = req.body;
    const data = req.user.data;

    if (data.accountType !== 3 && data.accountType !== 0) {
      return res.status(400).send({ message: "Function is not valid", statusCode: 400 });
    }

    const check_specialize = await Specialist.find({ _id: { $in: specialist } })
    if (check_specialize.length !== specialist.length) {
      return res.status(400).send({ message: "specialist is not valid", statusCode: 400 });
    }

    const hospital = await Hospital.findOne({ _id: data._id });
    const list_specialist = hospital.Specialist_ID;

    specialist = specialist.map((item) => {
      if (!list_specialist.includes(item)) {
        list_specialist.push(item);
      }
    })

    await Hospital.findOneAndUpdate(
      {
        _id: data._id
      },
      {
        Specialist_ID: list_specialist
      })
      .then(() => { return res.status(200).json({ message: "success" , statusCode: 200}) })
      .catch((err) => { return res.status(500).json({ message: err, statusCode: 500 }) })

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message, statusCode: 500 })
  }
}