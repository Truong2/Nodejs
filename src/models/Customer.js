const mongoose = require("mongoose");

const Customer = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    Customer_name: {
        type: String
    },
    Customer_email: {
        type: String,
        require: true
    },
    Cutomer_password: {
        type: String,
    },
    Customer_Identification: {
        type: String
    },
    Customer_Dsecentralize: {
        type: Number,
        ref: "Decentralize",
        require: true
    },

    Customer_phoneNumber: {
        type: String
    },
    Customer_gender: {
        type: Number
    },
    Customer_address: {
        type: String
    },
})

module.exports = mongoose.model("Customer", Customer);