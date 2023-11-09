import mongoose from "mongoose";
const Specialist = new mongoose.Schema({
    Specialist_ID: {
        type: Number
    },
    Specialist_hosId: {
        type: Number
    },
    Specialist_Name: {
        type: String
    },
    Specialist_userCreate: {
        type: Number
    },
    Specialist_createAt: {
        type: Date
    }

});

module.exports = mongoose.model("Specialist", Specialist);