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
    Custome_Identification: {
        type: String
    },

    Custome_phoneNumber: {
        type: String
    },
    Custome_gender: {
        type: Number
    },
    Custome_address: {
        type: String
    },
    Custome_decentralize: {
        type: Number,
        ref: "Decentralize"
    }
})

module.exports = mongoose.model("Customer", Customer);