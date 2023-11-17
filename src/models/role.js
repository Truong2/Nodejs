const mongoose = require("mongoose");

const role = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    user_id: {
        type: Number
    },
    role_doctor: {
        type: Number
    },
    role_hospital: {
        type: Number
    },
    role_customer: {
        type: Number
    },
    role_receptionist: {
        type: Number
    }
});
module.exports = mongoose.model("Role", role);