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
        requrie: true
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
    employee_Decentralize: [{
        type: Number,
        ref: "Decentralize",
        require: true
    }],

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
    SpecialistID: [{
        type: Number,
        ref: 'Specialists',
        default: null
    }],
    employeeSalary: {
        type: Number
    },
    employeeStartWorking: {
        type: Date
    },
    hopitalID: {
        type: Number,
        ref: 'Hospital',
        requrie: true
    },
    calendar: [{
        type: Number,
        ref: 'Calendar',
    }],
    calendarWorking: [{
        type: Number,
        ref: "CalendarWorking"
    }],
    CreateAt: {
        type: Date
    },
    UpdateAt: {
        type: Date
    },
    employeeStatus: {
        type: Number,
        default: 1
    }
}
);

module.exports = mongoose.model("Employee", Employee);