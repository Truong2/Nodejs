const mongoose = require("mongoose");
const roleUserShema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    nameRole: {
        type: String,
        required: true
    },
    codeRole: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("RoleUser", roleUserShema);