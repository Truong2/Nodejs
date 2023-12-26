const mongoose = require("mongoose");
const admin_model = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    Admin_name: {
        type: String,
        required: true
    },

    Admin_email: {
        type: String,
        required: true
    },
    Admin_password: {
        type: String,
        required: true
    },
    Admin_Dsecentralize: {
        type: Number,
        ref: "Decentralize",
        require: true
    },
    Admin_area: {
        type: Number,
        default: 0
    },
    CreateAt: {
        type: Date
    },
    status: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Admin", admin_model)