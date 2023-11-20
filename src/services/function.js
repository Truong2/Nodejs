const validator = require("email-validator");
const jwt = require('jsonwebtoken');
require("dotenv").config();
exports.maxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } });
    if (maxUser) {
        return maxUser._id;
    }
    return 0;

}

exports.checkEmail = async (email) => {
    // var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    return validator.validate(email);
    // if (!email)
    //     return false;

    // if (email.length > 254)
    //     return false;

    // var valid = emailRegex.test(email);
    // if (!valid)
    //     return false;

    // // Further checking of some things regex can't handle
    // var parts = email.split("@");
    // if (parts[0].length > 64)
    //     return false;

    // var domainParts = parts[1].split(".");
    // if (domainParts.some(function (part) { return part.length > 63; }))
    //     return false;

    // return true;
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
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};