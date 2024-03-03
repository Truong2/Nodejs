const mongoose = require("mongoose");
const Calendar = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String
    },
    identification: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    birthday: {
        type: Date
    },
    email: {
        type: String
    },
    adress: {
        type: String
    },
    reason: {
        type: String
    },
    serviceId: {
        type: Number
    },
    hospitalId: {
        type: Number
    },
    doctorId: {
        type: Number
    },
    time: {
        type: Date
    },
    timeAccept: {
        type: Date
    },
    creatAt: {
        type: Date
    },
    status: {
        type: Number
    }
})

module.exports = mongoose.model("Calendar", Calendar);