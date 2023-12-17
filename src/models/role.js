const mongoose = require("mongoose");

const role = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    role_name: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        require: true,
        default: 1 // 0 is active and 1 is deactive
    },
    role_user: [{
        type: Number,
        ref: 'RoleUser'
    }],
    role_createateAt: {
        type: Number,
        default: new Date().getTime()
    }
});
module.exports = mongoose.model("Role", role);