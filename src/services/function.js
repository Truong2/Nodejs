const validator = require("email-validator");
const jwt = require('jsonwebtoken');
const Employee = require("../models/Employee");
const Hospital = require("../models/Hospital");
const Customer = require("../models/Customer");
const Admin = require("../models//admin");
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

exports.getUserbyId = async (id_user, accountType) => {
    let user = {}
    if (accountType == 0) {
        let user = await Admin.findOne({ _id: id_user });
    } else if (accountType == 1 || accountType == 2) {
        let user = await Employee.findOne({ _id: id_user });
    } else if (accountType == 3) {
        let user = await Hospital.findOne({ _id: id_user });
    }
    else {
        let user = await Customer.findOne({ _id: id_user });
    }
    return user;
}

exports.checkRole = async (superior, inferior, accountType) => {
    user_superior = await getUserbyId(superior);
    user_inferior = await getUserbyId(inferior);
    let check_role = false;

    if (accountType == 3) {
        check_role = await Admin.exists({ _id: superior })
        return check_role;
    }
    else if (accountType == 1 || accountType == 2) {
        check_role = user_superior.id == user_inferior.hopitalID
    }
    else {
        check_role = await Admin.exists({ _id: superior })
    }
    return check_role;


}
exports.formatSeach = (name) => {
    return name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '\\$&')
}

exports.fotmatDate = (date) => {
    const d = new Date(date)
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()

}