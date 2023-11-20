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
    Admin_role: {
        // type: mongoose.Schema.Types.ObjectId,
        type: Number,
        ref: 'Role',
        default: null
    },
    Admin_area: {
        type: Number,
        default: 0
    },
    CreateAt: {
        type: Date
    }
})

module.exports = mongoose.model("Admin", admin_model)