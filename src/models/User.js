import mongoose, { mongo } from "mongoose";
const User = new mongoose.Schema({
    userID: {
        type: Number,
        require: true
    },
    userName: {
        type: String,
    },
    usertype: {
        type: Number,
        requrie: true
    },
    userAccount: {
        type: Number,
    },
    userPassword: {
        type: String
    },
    userIdentification: {
        type: String
    },
    userPhone: {
        type: String
    },
    userEmail: {
        type: String
    },
    userAddress: {
        type: String
    },
    userBirthday: {
        type: Date
    },
    userGender: {
        type: Number
    },
    userBankAcountNumber: {
        type: String
    },
    userBankName: {
        type: String
    },
    userExperience: {
        type: String
    },
    PracticingCertificateID: {
        type: String,
    },
    UPracticingCertificateImg: {
        type: String
    },
    certificateCreateAt: {
        type: Date
    },
    PracticingCertificateAdress: {
        type: String
    },
    userAcademicRank: {
        type: String
    },
    Specialist_ID: {
        type: Number
    },
    userSalary: {
        type: Number
    },
    userStartWorking: {
        type: Date
    },
    hopitalID: {
        type: Number
    },
    HopitalOwn: {
        type: String
    },
    CreateAt: {
        type: Date
    },
    UpdateAt: {
        type: Date
    },
    userStatus: {
        type: Number
    }
}
)

module.exports = mongoose.model("User", User);