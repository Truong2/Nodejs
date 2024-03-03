const mongoose = require("mongoose");

//các quyền của tài khoản người đùng
const roleUserShema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    role_name: {
        type: String,
        required: true
    },
    role_code: {
        type: String,
        required: true

    },
    type_account: {
        type: Number,
        require: true
    },
    createAt: {
        type: Number,
        default: new Date().getTime()
    },
    role_parent: {
        type: Number,
        default: null
    }
})
module.exports = mongoose.model("RoleUser", roleUserShema);