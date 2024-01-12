const mongoose = require("mongoose");
const CalendarWorking = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    hospitalId: {
        type: Number,
        required: true
    },
    date: {
        type: Number,//dvi sencond
        required: true
    },
    time_working: [{
        type: Number,
        ref: 'TimeWorking'
    }]
}, {
    versionKey: false
});

module.exports = mongoose.model("CalendarWorking", CalendarWorking);