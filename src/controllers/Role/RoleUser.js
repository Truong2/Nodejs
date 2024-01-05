const RoleUser = require("../../models/roleUser")
const functions = require("../../services/function")

exports.getListTypeAccount = async (req, res) => {
  try {
    const data = ['Admin', 'Bác sĩ', 'Lễ tân', 'Cơ sở y tế', 'Khách hàng']
    return res.status(200).json({ data: data, message: "success" })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

exports.createRoleUser = async (req, res) => {
  try {
    let { role_name,
      type_account,
      role_parent,
      code
    } = req.body;

    const accountType = req.user.data.accountType;
    if (accountType !== 0 && accountType !== 3) {
      return res.status(404).json({ message: "function is not valid" })
    }

    if (!role_name || !code || !type_account) {
      return res.status(400).json({ message: "Bad request" })
    }
    const maxID_roleUser = await functions.maxID(RoleUser)

    const new_roleUser = new RoleUser({
      _id: maxID_roleUser + 1,
      role_name: (role_name),
      type_account: type_account,
      role_code: code,
      role_parent: role_parent || null
    })
    await new_roleUser.save()
    return res.status(200).json({ message: "Add role user sucess" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

exports.EditRleUser = async (req, res) => {
  try {
    let { id,
      role_name,
    } = req.body;
    const accountType = req.user.data.accountType;
    if (accountType !== 0) {
      return res.status(400).json({ message: "function is not valid" })
    }
    if (!role_name || !id) {
      return res.status(404).json({ message: "Bad request" })
    }
    const check_exists = await RoleUser.exists({ _id: id })
    if (!check_exists) {
      return res.status(404).json({ message: "Role is not exists" })
    }
    await RoleUser.findOneAndUpdate(
      { _id: id },
      {
        role_name: role_name,
        // role_code: code,
      }
    )
    return res.status(200).json({ message: " update success" })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

exports.deleteRoleUser = async (req, res) => {
  try {
    let { id,
    } = req.params;
    const accountType = req.user.data.accountType;
    if (accountType !== 0) {
      return res.status(400).json({ message: "function is not valid" })
    }
    if (!id) {
      return res.status(404).json({ message: "Bad request" })
    }
    const check_exists = await RoleUser.exists({ _id: Number(id) })
    if (!check_exists) {
      return res.status(404).json({ message: "Role is not exists" })
    }
    await RoleUser.findOneAndDelete(
      { _id: id }
    )
    return res.status(200).json({ message: " delete success" })
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message })
  }
}

exports.getListRoleUser = async (req, res) => {
  try {
    let { name } = req.query;
    let data = await RoleUser.aggregate([

      {
        $match: {
          $and: [
            { role_parent: null },
            { role_name: { $regex: new RegExp(name, "i") } }
          ]
        }
      },
      {
        $lookup:
        {
          from: 'roleusers',
          localField: "_id",
          foreignField: 'role_parent',
          as: "role_child"
        }
      },
      { $unwind: { path: "$role_child", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$role_name' },
          role_child: { $push: "$role_child" },
          code: { $first: '$role_code' },
          role_parent: { $first: '$role_parent' },
        }
      },
      {
        $sort: {
          name: 1
        }
      }
    ])
    return res.status(200).json({ message: "success", data: data })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

exports.getListRoleUserChild = async (req, res) => {
  try {
    let id_group_role = req.params.id;
    let list_role_user = await RoleUser.find({ role_parent: Number(id_group_role) })
    return res.status(200).json({ message: "success", data: list_role_user })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}
