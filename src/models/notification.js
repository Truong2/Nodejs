const mongoose = require("mongoose")
const notification_schema = new mongoose.Schema({
  _id: {
    type: Number
  },
  user_recive: {
    type: Number
  },
  content: {
    type: String,
    require: true
  },
  createAt: {
    type: Number,
    require: true
  },
  status: {
    type: Number
  }
});

module.exports = mongoose.model("Notification", notification_schema)