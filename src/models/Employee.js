const mongoose = require("mongoose");
const Employee = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    employeeName: {
        type: String,
    },
    employeeType: {
        type: Number,
        requrie: true
    },
    employeeEmail: {
        type: String,

    },
    employeePassword: {
        type: String,
        requrie: true
    },
    employeeIdentification: {
        type: String
    },
    employeePhone: {
        type: String
    },

    employeeAddress: {
        type: String
    },
    employeeBirthday: {
        type: Date
    },
    employeeGender: {
        type: Number
    },
    employeeBankAcountNumber: {
        type: String
    },
    employeeBankName: {
        type: String
    },
    employeeExperience: {
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
    employeeAcademicRank: {
        type: String
    },
    SpecialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialists',
        default: null
    },
    employeeSalary: {
        type: Number
    },
    employeeStartWorking: {
        type: Date
    },
    hopitalID: {
        //type: mongoose.Schema.Types.ObjectId,

        type: Number,
        ref: 'Hospital',
        requrie: true
    },
    calendar: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calendar',
    }],
    calendarWorking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CalendarWorking"
    }],
    employeeDsecentralize: {
        type: Number,
        ref: "Decentralize"
    },
    CreateAt: {
        type: Date
    },
    UpdateAt: {
        type: Date
    },
    employeeStatus: {
        type: Number
    }
}
);

module.exports = mongoose.model("Employee", Employee);