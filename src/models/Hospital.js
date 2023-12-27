const mongoose = require("mongoose");
const Hospital = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    hospitalName: {
        type: String,
        require: true
    },
    hospitalEmail: {
        type: String,
        require: true
    },
    hospitalPassword: {
        type: String,
        require: true
    },
    hospitalIdentification: {
        type: String
    },
    hospitalDsecentralize: {
        type: Number,
        ref: "Decentralize",
        require: true
    },
    hospitalPhone: {
        type: String,
    },
    hospitalAddress: {
        type: String
    },
    hos_PracticingCertificateID: {
        type: String
    },
    hos_UPracticingCertificateImg: {
        type: String
    },
    hos_certificateCreateAt: {
        type: String
    },
    Specialist_ID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialists',
    }],
    emplyee_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    }],
    CreateAt: {
        type: Date
    },
    UpdateAt: {
        type: Date
    },
    hopitalStatus: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Hospital", Hospital);