const mongoose = require("mongoose");
const Service = new mongoose.Schema({
    _id: {
        type: Number
    },
    Hos_service_cost: {
        type: Number
    },
    Hos_serviceCode: {
        type: Number
    },
    Hos_service_userUsed: {
        type: Number
    },
    HosId: {
        type: Number
    },
    SpeecialisID: {
        type: Number
    },
    Hos_serviceReview: {
        type: Number
    }
});


module.exports = mongoose.model("Service", Service);