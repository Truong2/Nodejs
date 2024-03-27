const mongoose = require("mongoose");
const Service = new mongoose.Schema({
    _id: {
        type: Number,
        require: true,
    },

    serviceName: {
        type: String,
        require: true
    },
    serviceCost: {
        type: Number
    },
    calendarWorking: [{
        type: Number,
    }],
    service_userUsed: {//số người sử dụng
        type: Number,
        default: 0
    },
    HosId: {
        type: Number,
        require: true
    },
    SpecialistId: [{
        type: Number
    }],
    type_service: [{
        type: Number,
        require: true
    }],
    status: {
        type: Number,
        default: 1
    }
}, {
    versionKey: false
});


module.exports = mongoose.model("Service", Service);