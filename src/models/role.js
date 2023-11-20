const mongoose = require("mongoose");

const role = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    user_id: {
        type: Number,
        required: true
    },
    account_type: {
        type: Number,
        required: true
    },
    role_admin: {
        type: Number,
        default: 0
    },
    role_doctor: {// bác sĩ 
        type: Number,
        default: 0
    },
    role_hospital: {//cơ sở y tế 
        type: Number,
        default: 0
    },
    role_customer: {// khách hàng 
        type: Number,
        default: 0
    },
    role_receptionist: {//lễ tân 
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model("Role", role);