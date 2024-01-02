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
    Specialist_userCreate_name: {
        type: String,
        require: true
    },
    Specialist_userCreate_accountType: {
        type: Number,
        require: true
    },
    Specialist_createAt: {
        type: Number,
        default: new Date().getTime()
    },
    Specialist_statusAccept: {
        type: Number,
        default: 1, //1- accept , 0 - don't accept
    }
});

module.exports = mongoose.model("Specialist", Specialist);