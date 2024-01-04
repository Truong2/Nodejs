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
            return res.status(404).json({ message: "function is not valid" })
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
        return res.status(500).json({ message: err.message })
    }

}

exports.add_specialist_hospital = async (req, res) => {
    try {
        let {
            specialist_id
        } = req.body;
        const data = req.user;
        console.log((specialist_id));
        specialist_id = Object.values(JSON.parse(specialist_id))
        console.log(typeof (specialist_id));
        console.log((specialist_id));
        return res.status(404).json({ message: specialist_id })
        if (data.data.accountType !== 3 && data.data.accountType !== 0) {
            return res.status(404).json({ message: "function is not valid" })
        }

        const list_special = await Specialist.findOne({ _id: { $in: specialist_id } });
        console.log(list_special)

        if (specialist_id) {
            for (let i = 0; i < length; i++) {
                const maxId_listSpecialist = await func.maxID(ListSpecialist)
                const new_listSpecialist = new ListSpecialist({
                    _id: maxId_listSpecialist,

                })
            }
        }

    } catch (err) {
        console.log("err: ", err)
        return res.status(500).json({ message: err.message })
    }
}