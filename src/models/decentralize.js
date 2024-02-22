const mongoose = require("mongoose")


//tài khoản nào có những quyền gì 
const decentralizeModel = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  decentralize_name: {
    type: String,
    require: true
  },
  decentralize_role: [{
    type: Number,
    default: 0,
    ref: 'RoleUser'
  }],
  decentralize_code: {
    type: String,
    require: true
  },
  typeAccount: {
    type:Number,
  },
  status: {
    type: Number,
    default: 1 // 1-Active , 0-Inactive
  }
})

module.exports = mongoose.model("Decentralize", decentralizeModel)