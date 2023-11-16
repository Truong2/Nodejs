const mongoose = require("mongoose");
const TypeService = new mongoose.Schema({
    _id: {
        type: Number,
        require: true,
    },
    serviceName: {
        type: Number,
    },
    serviceCreateAt: {
        type: Date
    },
    service_userCreate: {
        type: Number
    },
    serviceStatus: {
        type: Number
    },
    service_AcceptAt: {
        type: Date
    },
    service_userAccept: {
        type: Number
    }
})

module.exports = mongoose.model("TypeService", TypeService);