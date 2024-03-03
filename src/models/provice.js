const mongoose = require("mongoose")
const province_schema = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
    unique: true

  },
  name: {
    type: String,
    require: true,
  },
  full_name: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
    // unique: true
  }
})

module.exports = mongoose.model("Province", province_schema)