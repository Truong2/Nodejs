const mongoose = require("mongoose");
const Specialist = new mongoose.Schema({
    _id: {
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
    },
});

module.exports = mongoose.model("ListSpecialist", Specialist);