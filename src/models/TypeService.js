const mongoose = require("mongoose");
const TypeService = new mongoose.Schema({
    _id: {
        type: Number,
        require: true,
    },
    serviceName: {
        type: String,
        require: true,
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
        default : 1
    },
    AcceptAt: {
        type: Date
    },
    userAccept: {
        type: Number
    }
})

module.exports = mongoose.model("TypeService", TypeService);