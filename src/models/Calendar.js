const mongoose = require("mongoose");
const Calendar = new mongoose.Schema({
    _id: {
        type: Number
    },
    user_create: {
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
        type: Number// second
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
        type: Number
    },
    timeAccept: {
        type: Date
    },
    creatAt: {
        type: Number// second
    },
    status: {
        type: Number
    }
})

module.exports = mongoose.model("Calendar", Calendar);