const mongoose = require("mongoose")
const User_schema = new mongoose.Schema({
  _id: {
    type: Number,
    require: true
  },
  type: {
    type: Number,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  district: {
    type: String,
  },
  ward: {
    type: String
  },
  province: {
    type: String
  },
  avatar: {
    type: String
  },
  password: {
    type: String,
    require: true
  },
  identification: {
    type: String,
  },
  phoneNumber: {
    type: String,
    require: true
  },
  address: {
    type: String,
  },
  decentrialize: [{
    type: Number,
    require: true
  }],
  calendarWorking: [{
    type: Number,
  }],
  DOB: {
    type: Number
  },
  gender: {
    type: Number,
    default: 0
  },
  experient: {
    type: String
  },
  specialistId: [{
    type: Number
  }],
  hospitalId: {
    type: Number
  },
  startWorking: {
    type: Number
  },
  createAt: {
    type: Number //second
  },
  status: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model("Users", User_schema)