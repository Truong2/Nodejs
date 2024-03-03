const mongoose = require("mongoose")
const district_schema = new mongoose.Schema({
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

module.exports = mongoose.model("District", district_schema)