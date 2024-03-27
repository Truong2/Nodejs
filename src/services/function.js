const validator = require("email-validator");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const moment = require('moment');
exports.maxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } });
    if (maxUser) {
        return maxUser._id;
    }
    return 0;
}

exports.checkEmail = async (email) => {
    return validator.validate(email);
}

exports.checkPhoneNumber = async (phone) => {
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    return phoneNumberRegex.test(phone)
}

exports.createToken = async (data, time) => {
    return jwt.sign({
        data: data
    }, process.env.SECRET, { expiresIn: time });
}

exports.checkToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Missing token", statusCode: 401 });
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token", statusCode: 403 });
        }
        req.user = user;
        next();
    });
};


exports.formatSeach = (name) => {
    return name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '\\$&')
}

exports.getFirstSecondOfDay = (timestamp) => {
    const day = moment.utc(timestamp * 1000).local().startOf('day').unix();
    return day;
}
