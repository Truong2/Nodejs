const Decentralize = require("../../models/decentralize")
const functions = require("../../services/function")
const RoleUser = require('../../models/roleUser');
const { format } = require("express-form-data");
exports.createRole = async (req, res) => {
    try {
        let {
            name_role,
            status,
            decentralize_role,
            typeAccount,
            decentralize_code
        } = req.body;
        const accountType = req.user.data.accountType;
        if (accountType !== 0) {
            return res.status(400).json({ message: "function is not valid" })
        }
        if (!name_role && decentralize_role.length === 0) {
            return res.status(200).json({ message: "bad request" })
        }
        decentralize_role = decentralize_role.replace('[', '').replace(']', '').split(",").map(String)
        const check_list_role = await RoleUser.find({ _id: { $in: decentralize_role } })
        if (check_list_role.length !== decentralize_role.length) {
            return res.status(200).json({ message: "list role is not valid" })
        }
        const maxId_role = await functions.maxID(Decentralize)
        const new_role = new Decentralize({
            _id: maxId_role + 1,
            decentralize_name: name_role,
            decentralize_role: decentralize_role,
            status: status,
            typeAccount: typeAccount,
            decentralize_code: decentralize_code
        })
        await new_role.save()
            .then(() => { return res.status(200).json({ message: "add role success" }) })
            .catch((err) => { return res.status(500).json({ message: err }) })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message })
    }
}

exports.updateDecentralize = async (req, res) => {
    try {
        let {
            decentralize_id,
            name_role,
            status,
            decentralize_role,
            code

        } = req.body;

        const accountType = req.user.data.accountType;
        if (accountType !== 0) {
            return res.status(400).json({ message: "function is not valid" })
        }
        if (!name_role && decentralize_role.length === 0 || !decentralize_id) {
            return res.status(200).json({ message: "bad request" })
        }
        decentralize_role = decentralize_role.replace('[', '').replace(']', '').split(",").map(String)
        const check_list_role = await RoleUser.find({ _id: { $in: decentralize_role } })
        if (check_list_role.length !== decentralize_role.length) {
            return res.status(400).json({ message: "list role is not valid" })
        }
        const check_exists = await Decentralize.exists({ _id: decentralize_id })
        if (!check_exists) {
            return res.status(400).json({ message: "dencetrale is not exists" })
        }
        await Decentralize.findOneAndUpdate(
            { _id: decentralize_id },
            {
                decentralize_name: name_role,
                status: status,
                decentralize_role: decentralize_role,
                decentralize_code: code
            }
        )
            .then(() => { return res.status(200).json({ message: "update role success" }) })
            .catch((err) => { return res.status(500).json({ message: err }) })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

exports.deletedentralize = async (req, res) => {
    try {
        let decentralize_id = req.body.id;
        const accountType = req.user.data.accountType;
        if (accountType !== 0) {
            return res.status(400).json({ message: "function is not valid" })
        }
        if (!decentralize_id) {
            return res.status(200).json({ message: "bad request" })
        }
        const check_exists = await Decentralize.exists({ _id: decentralize_id })
        if (!check_exists) {
            return res.status(404).json({ message: "Decentralize is not exists" })
        }
        await Decentralize.findOneAndDelete({ _id: decentralize_id })
            .then(() => { return res.status(200).json({ message: "delete decentralize success" }) })
            .catch((err) => { return res.status(400).json({ message: err.message }) })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}
exports.listDecentralize = async (req, res) => {
    try {
        const accountType = req.user.data.accountType;
        if (accountType !== 0) {
            return res.status(400).json({ message: "function is not valid" })
        }
        const list_decentralize = await Decentralize.find()
        return res.status(200).json({ data: list_decentralize, message: "get list  decentralize success" })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

exports.detailDecentralizes = async (req, res) => {
    try {
        let decentralize_id = req.body.id;
        const accountType = req.user.data.accountType;
        if (accountType !== 0) {
            return res.status(400).json({ message: "function is not valid" })
        }
        const list_decentralize = await Decentralize.aggregate([
            {
                $match: {
                    _id: decentralize_id
                }
            },
            {
                $lookup: {
                    from: 'roleusers',
                    localField: 'decentralize_role',
                    foreignField: '_id',
                    as: 'Role'
                }
            },
            { $unwind: { path: '$Role', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    'id': ' $_id',
                    'decentralize_name': '$decentralize_name',
                    'decentralize_role': ['$Role.role_name'],
                    'decentralize_code': '$decentralize_code',
                    'status': '$status'
                }
            }
        ])
        return res.status(200).json({ data: list_decentralize, message: "get list decentralize success" })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}
