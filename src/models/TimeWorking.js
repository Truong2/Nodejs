const mongoose = require('mongoose')
const time_working_model = new mongoose.Schema({
  _id: {
    type: Number,
    require: true,
  },
  time_working: {
    type: String,
    require: true
  }
}, {
  versionKey: false,
})

module.exports = mongoose.model("timeWorking", time_working_model)