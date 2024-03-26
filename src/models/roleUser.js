const mongoose = require("mongoose");

//các quyền của tài khoản người đùng
const roleUserShema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    roleName: {
        type: String,
        required: true
    },
    roleCode: {
        type: String,
        required: true

    },
    typeAccount: {
        type: Number,
        require: true
    },
    createAt: {
        type: Number,
        default: new Date().getTime()
    },
    roleParent: {
        type: Number,
        default: null
    }
})
module.exports = mongoose.model("RoleUser", roleUserShema);