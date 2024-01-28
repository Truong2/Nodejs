const Specialist = require("../../models/Specialist")
const ListSpecialist = require("../../models/ListSpecialist")
const func = require("../../services/function")

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
    const list_specialist = await ListSpecialist.find({

    })
}

