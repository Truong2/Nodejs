import mongoose from "mongoose";
const Calendar = new mongoose.Schema({
    Calendar_Id: {
        type: Number
    },
    Calendar_userName: {
        type: String
    },
    Calendar_userIdentification: {
        type: String
    },
    Calendar_userPhone: {
        type: String
    },
    Calendar_userDOB: {
        type: Date
    },
    Carlendar_userEmail: {
        type: String
    },
    Carlendar_userAddress: {
        type: String
    },
    Carlendar_reason: {
        type: String
    },
    Carlendar_userInsuranceNumber: {
        type: String
    },
    Carlendar_serviceId: {
        type: Number
    },
    Calendar_hospitalBook: {
        type: Number
    },
    Calendar_doctorBook: {
        type: Number
    },
    Calendar_timeBook: {
        type: Date
    },
    Carlendar_userAccept: {
        type: Number
    },
    Carlendar_timeAccept: {
        type: Date
    },
    Calendar_CreatAt: {
        type: Date
    },
    Carlerndar_status: {
        type: Number
    }
})

module.exports = mongoose.model("Calendar", Calendar);