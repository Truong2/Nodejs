import mongoose from "mongoose";
const Service = new mongoose.Schema({
    Hos_serviceID: {
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
    Speecialist_ID: {
        type: Number
    },
    Hos_serviceReview: {
        type: Number
    }
});


module.exports = mongoose.model("Service", Service);