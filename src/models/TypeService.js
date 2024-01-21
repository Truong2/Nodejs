const mongoose = require("mongoose");
const TypeService = new mongoose.Schema({
    _id: {
        type: Number,
        require: true,
    },
    serviceCode: {
        type: String,
        unique: true,
        require: true
    },
    serviceName: {
        type: String,
        require: true,
        unique: true,
    },
    createAt: {
        type: Date,
        default: new Date()
    },
    userCreate: {
        type: Number
    },
    status: {
        type: Number,
        default: 1
    },
})

module.exports = mongoose.model("TypeService", TypeService);