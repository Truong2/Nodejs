const mongoose = require("mongoose");
const Specialist = new mongoose.Schema({
    _id: {
        type: Number
    },
    Specialist_Name: {
        type: String
    },
    Specialist_userCreate_id: {
        type: Number,
        require: true
    },
    Specialist_createAt: {
        type: Number,
        default: new Date().getTime()
    },
});

module.exports = mongoose.model("Specialist", Specialist);