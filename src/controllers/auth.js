const Employee = require("../models/Employee");
const Hospital = require("../models/Hospital");
const Customer = require("../models/Customer");
const RoleUser = require("../models/roleUser");
const Admin = require("../models//admin");
const Role = require("../models/role");
const func = require("../services/function");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const next = require("../utils/next");
const Decentralize = require("../models/decentralize");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError ");
require("dotenv").config();

exports.Register = async (req, res) => {
  let {
    userName,
    userType, //1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách  hàng
    userEmail,
    userPassword,
    userPhoneNumber,
    userBirthday,
    decentralize,
    userGender, //1-nam ,2-nữ
    hopitalID,
  } = req.body;

  userPassword = await bcrypt.hash(userPassword, 10);

  if (
    userType === undefined ||
    userType === null ||
    userType === "" ||
    !userEmail ||
    !userPassword
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "input is not valid");
  }

  let checkEmail = await func.checkEmail(userEmail);
  if (!checkEmail) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "email is not valid");
  }

  let checkPhone = await func.checkPhoneNumber(userPhoneNumber);
  if (!checkPhone) {
    throw new ApiError(StatusCodes.NOT_FOUND, "phoneNumber is not valid");
  }

  const check_decentralize = await Decentralize.find({
    _id: { $in: decentralize },
  });
  if (check_decentralize.length != decentralize.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "id decentralize is not valid");
  }

  if (userType == 0) {
    //admin
    let checkExits = await Admin.exists({
      Admin_email: userEmail.toLowerCase(),
    });
    if (checkExits) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "email already used");
    }
    let maxId_admin = await func.maxID(Admin);

    const new_Admin = new Admin({
      _id: maxId_admin + 1,
      Admin_name: userName,
      Admin_email: userEmail.toLowerCase(),
      Admin_password: userPassword,
      Admin_Dsecentralize: decentralize,
      CreateAt: new Date(),
    });
    await new_Admin
      .save()
      .then(() => res.status(200).json({ message: "add admin success" }))
      .catch((err) => res.status(400).json({ message: err.message }));
  } else if (userType == 1 || userType == 2) {
    let checkExits = await Employee.exists({
      employeeEmail: userEmail.toLowerCase(),
    });
    if (checkExits) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "email already used");
    }

    if (!hopitalID || typeof Number(hopitalID) !== "number") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "id hospital is not valid");
    }

    let maxId_employee = await func.maxID(Employee);

    const new_Employee = new Employee({
      _id: maxId_employee + 1,
      employeeName: userName,
      employeeType: Number(userType),
      employeeEmail: userEmail.toLowerCase(),
      employeePassword: userPassword,
      employeePhone: userPhoneNumber,
      employeeBirthday: userBirthday,
      employeeGender: userGender,
      hopitalID: hopitalID,
      employee_Dsecentralize: decentralize,
      CreateAt: new Date(),
    });

    await new_Employee
      .save()
      .then(() => res.status(200).json({ message: "add employee success" }))
      .catch((err) => res.status(400).json({ message: err.message }));
  } else if (userType == 3) {
    let checkExits = await Hospital.exists({
      hospitalEmail: userEmail.toLowerCase(),
    });
    if (checkExits) {
      return res.status(400).json({ message: "email already used" });
    }
    let maxId_Hos = await func.maxID(Hospital);

    const new_Hospital = new Hospital({
      _id: maxId_Hos + 1,
      hospitalName: userName,
      hospitalEmail: userEmail.toLowerCase(),
      hospitalPassword: userPassword,
      hospitalPhone: userPhoneNumber,
      hospitalDsecentralize: decentralize,
      CreateAt: new Date(),
    });

    await new_Hospital
      .save()
      .then(() => res.status(200).json({ message: "add hospital success" }))
      .catch((err) => res.status(400).json({ message: err.message }));
  } else if (userType == 4) {
    let checkExits = await Customer.exists({
      Customer_email: userEmail.toLowerCase(),
    });
    if (checkExits) {
      throw new Error(StatusCodes.BAD_REQUEST, "email already used");
    }
    let maxId_cus = await func.maxID(Customer);
    let maxId_role = await func.maxID(Role);

    const role_hos = new Role({
      _id: maxId_role + 1,
      user_id: maxId_cus + 1,
      role_customer: 1,
      account_type: 4,
    });
    await role_hos.save();

    const new_Customer = new Customer({
      _id: maxId_cus + 1,
      Customer_name: userName,
      Customer_email: userEmail.toLowerCase(),
      Cutomer_password: userPassword,
      Customer_phoneNumber: userPhoneNumber,
      Customer_Dsecentralize: decentralize,
      CreateAt: new Date(),
    });

    await new_Customer
      .save()
      .then(() => res.status(200).json({ message: "add customer success" }))
      .catch((err) => res.status(400).json({ message: err.message }));
  } else {
    throw new ApiError(StatusCodes.BAD_REQUEST, "userType is not valid");
  }
};

exports.login = async (req, res) => {
  try {
    let {
      email,
      password,
      userType, //0-admin 1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách hàng
    } = req.body;
    console.log(email);
    console.log(password);
    if (typeof Number(userType) !== "number" || !email || !password) {
      return res.status(404).json({ message: "input is not valid" });
    }
    //find by email and password
    //0-admin1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách  hàng
    if (userType == 0) {
      let findUser = await Admin.findOne({
        Admin_email: email.toLowerCase(),
      });
      if (!findUser) {
        return res.status(400).json({ message: "email  is not correct" });
      }
      let check_password = await bcrypt.compare(
        password,
        findUser.Admin_password
      );
      if (!check_password) {
        return res.status(404).json({ message: "password is not valid" });
      }
      let data = {
        _id: findUser._id,
        name: findUser.Admin_name,
        // area: findUser.Admin_area,
        accountType: 0,
        createAt: findUser.CreateAt,
        decentralize: findUser.Admin_Dsecentralize,
        status: findUser.status,
        email: findUser.Admin_email,
        // address: findUser.address
      };
      let token = await func.createToken(data, "7d");
      // let role = await Role.findOne({ user_id: findUser._id, account_type: 0 });
      res
        .status(200)
        .json({ data: { token: token }, message: " admin login sucess" });
    } else if (userType == 1 || userType == 2) {
      let findUser = await Employee.findOne({
        employeeEmail: email.toLowerCase(),
      });
      if (!findUser) {
        return res.status(400).json({ message: "email  is not correct" });
      }
      let check_password = await bcrypt.compare(
        password,
        findUser.employeePassword
      );
      if (!check_password) {
        return res.status(404).json({ message: "password is not valid" });
      }
      let data = {
        _id: findUser._id,
        name: findUser.employeeName,
        accountType: findUser.employeeType,
        identification: findUser.employeeIdentification,
        phone: findUser.employeePhone,
        address: findUser.employeeAddress,
        birthday: findUser.employeeBirthday,
        gender: findUser.employeeGender,
        email: findUser.employeeEmail,
      };
      let token = await func.createToken(data, "7d");
      //  let role = await Role.findOne({ user_id: findUser._id, account_type: findUser.employeeType });
      res
        .status(200)
        .json({ data: { token: token }, message: " employee login sucess" });
    } else if (userType == 3) {
      let findUser = await Hospital.findOne({
        hospitalEmail: email.toLowerCase(),
      });
      if (!findUser) {
        return res.status(400).json({ message: "email is not correct" });
      }
      let check_password = await bcrypt.compare(
        password,
        findUser.hospitalPassword
      );
      if (!check_password) {
        return res.status(404).json({ message: "password is not valid" });
      }
      let data = {
        _id: findUser._id,
        name: findUser.hospitalName,
        accountType: 3,
        email: findUser.hospitalEmail,
        identification: findUser.hospitalIdentification,
        phone: findUser.hospitalPhone,
        address: findUser.hospitalAddress,
        //  birthday: findUser.employeeBirthday,
        //   gender: findUser.employeeGender,
        // roleId: findUser.roleId,
      };
      let token = await func.createToken(data, "7d");
      let role = await Role.findOne({ user_id: findUser._id, account_type: 3 });
      res
        .status(200)
        .json({ data: { token: token }, message: " hospital login sucess" });
    } else if (userType == 4) {
      let findUser = await Customer.findOne({
        Customer_email: email.toLowerCase(),
      });
      if (!findUser) {
        return res
          .status(400)
          .json({ message: "email or password is not correct" });
      }
      let check_password = await bcrypt.compare(
        password,
        findUser.Cutomer_password
      );
      if (!check_password) {
        return res.status(404).json({ message: "password is not valid" });
      }
      let data = {
        _id: findUser._id,
        name: findUser.Customer_name,
        accountType: 4,
        identification: findUser.Customer_Identification,
        phone: findUser.Customer_phoneNumber,
        address: findUser.Customer_address,
        birthday: findUser.employeeBirthday,
        gender: findUser.Customer_birthday,
      };
      let token = await func.createToken(data, "7d");
      res
        .status(200)
        .json({ data: { token: token }, message: " custommeer login sucess" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getInfoPerson = async (req, res) => {
  try {
    let { _id, accountType } = req.user.data;

    if (accountType == 0) {
      let info = await Admin.aggregate([
        {
          $match: {
            _id: _id,
          },
        },
        {
          $lookup: {
            from: "decentralizes",
            localField: "employee_Dsecentralize",
            foreignField: "_id",
            as: "Decentralize",
          },
        },
        {
          $unwind: { path: "$Decentralize", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: {
            path: "$Decentralize.decentralize_role",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "roleusers",
            localField: "Decentralize.decentralize_role",
            foreignField: "_id",
            as: "roleusers",
          },
        },
        { $unwind: { path: "$roleusers", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$Admin_name" },
            role: { $first: "$Decentralize.decentralize_name" },
            role_id: { $first: "$Decentralize._id" },
            area: { $first: "$Admin_area" || 0 },
            roleusers: { $push: "$roleusers" },
            type_account: { $first: accountType },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists" });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info admin sucess" });
    } else if (accountType == 1 || accountType == 2) {
      let info = await Employee.aggregate([
        {
          $match: {
            _id: _id,
          },
        },
        {
          $lookup: {
            from: "decentralizes",
            localField: "employee_Dsecentralize",
            foreignField: "_id",
            as: "Decentralize",
          },
        },
        {
          $unwind: { path: "$Decentralize", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: {
            path: "$Decentralize.decentralize_role", // Unwind the decentralize_role array
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "roleusers", // The collection to join with
            localField: "Decentralize.decentralize_role",
            foreignField: "_id",
            as: "roleusers",
          },
        },
        { $unwind: { path: "$roleusers", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$employeeName" },
            role: { $first: "$Decentralize.decentralize_name" },
            role_id: { $first: "$Decentralize._id" },
            roleusers: { $push: "$roleusers" },
            email: { $first: "$employeeEmail" },
            phone: { $first: "$employeePhone" },
            address: { $first: "$employeeAddress" },
            birthday: { $first: "$employeeBirthday" },
            experience: { $first: "$employeeExperience" },
            hopitalId: { $first: "$hopitalID" },
            status: { $first: "$employeeStatus" },
            type_account: { $first: accountType },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists" });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info employee success" });
    } else if (accountType == 3) {
      let info = await Hospital.aggregate([
        {
          $match: {
            _id: _id,
          },
        },
        {
          $lookup: {
            from: "decentralizes",
            localField: "hospitalDsecentralize",
            foreignField: "_id",
            as: "Decentralize",
          },
        },
        {
          $unwind: { path: "$Decentralize", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: {
            path: "$Decentralize.decentralize_role", // Unwind the decentralize_role array
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "roleusers", // The collection to join with
            localField: "Decentralize.decentralize_role",
            foreignField: "_id",
            as: "roleusers",
          },
        },
        { $unwind: { path: "$roleusers", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$hospitalName" },
            role: { $first: "$Decentralize.decentralize_name" },
            role_id: { $first: "$Decentralize._id" },
            roleusers: { $push: "$roleusers" },
            email: { $first: "$hospitalEmail" },
            phone: { $first: "$hospitalPhone" },
            address: { $first: "$hospitalAddress" },
            status: { $first: "$hopitalStatus" },
            type_account: { $first: accountType },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists" });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info Hospital success" });
    } else if (accountType == 4) {
      let info = await Customer.aggregate([
        {
          $match: {
            _id: _id,
          },
        },
        {
          $lookup: {
            from: "decentralizes",
            localField: "Customer_Dsecentralize",
            foreignField: "_id",
            as: "Decentralize",
          },
        },
        {
          $unwind: { path: "$Decentralize", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: {
            path: "$Decentralize.decentralize_role", // Unwind the decentralize_role array
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "roleusers", // The collection to join with
            localField: "Decentralize.decentralize_role",
            foreignField: "_id",
            as: "roleusers",
          },
        },
        { $unwind: { path: "$roleusers", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$Customer_name" },
            role: { $first: "$Decentralize.decentralize_name" },
            role_id: { $first: "$Decentralize._id" },
            roleusers: { $push: "$roleusers" },
            email: { $first: "$Customer_email" },
            phone: { $first: "$Customer_phoneNumber" },
            address: { $first: "$Customer_address" },
            status: { $first: "$hopitalStatus" },
            type_account: { $first: accountType },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists" });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info customer success" });
    } else {
      return res
        .status(400)
        .json({ message: "you don't have permission to access this page" });
    }
  } catch (err) {
    {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  }
};

exports.forgotPassword = async (req, res) => {
  let { email, typeAcc } = req.body;
  try {
    let user = {};
    if (typeAcc == 0) {
      user = await Admin.findOne({ Admin_email: email });
    } else if (typeAcc == 1 || typeAcc == 2) {
      user = await Employee.findOne({ employeeEmail: email });
    } else if (typeAcc == 3) {
      user = await Hospital.findOne({ hospitalEmail: email });
    } else if (typeAcc == 4) {
      user = await Customer.json({ Customer_email: email });
    } else {
      return res.status(400).send({ message: "type Account is not valid" });
    }
    if (!user) {
      return res
        .status(404)
        .json({ meessage: "can not find the user in databases" });
    }
    resetToken = "";
    const resetUrl = `${req.protocol}:://${req.get(
      "host"
    )}/api/v1/user/resetPassword/${resetToken} `;
    const message = `We have received a password request.Please use the below link to reset your password\n\n ${resetUrl}\n\nThis reset password link be valid only 10 minutes.`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tinh.nv1610@gmail.com",
        pass: "tinh16102001",
      },
    });
    // use a template file with nodemailer
    const mailOptions = {
      from: "tinh.nv1610@gmail.com", // sender address
      template: "email", // the name of the template file, i.e., email.handlebars
      to: email,
      subject: "Welcome to My Company,",
      context: {
        name: "tinh",
        company: "my company",
      },
    };
    try {
      await transporter
        .sendMail(mailOptions)
        .then((data) => {
          console.log("Mail sent", data);
        })
        .catch((err) => {
          console.log("Failure", err);
        });
      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.decentralization = async (req, res) => {
  try {
    // let { _id, accountType } = req.user.data;
    let superior = req.user.data._id;
    let accountType = req.user.data.accountType;
    let { inferior, role_accounts } = req.body;
    if (accountType > 4 || accountType < 0) {
      return res
        .status(400)
        .json({ data: superior, message: "accountType is not valid" });
    }
    let check_user = true;
    if (accountType == 0) {
      check_user = await Admin.exists({ _id: superior });
      check_user = await Admin.exists({ _id: inferior });
    } else if (accountType == 1 || accountType == 2) {
      check_user = await Employee.exists({ _id: superior });
      check_user = await Employee.exists({ _id: inferior });
    } else if (accountType == 3) {
      check_user = await Hospital.exists({ _id: superior });
      check_user = await Hospital.exists({ _id: inferior });
    } else if (accountType == 4) {
      check_user = await Customer.exists({ _id: superior });
      check_user = await Customer.exists({ _id: inferior });
    }

    if (!check_user) {
      return res.status(500).json({ message: "id user is not valid" });
    }
    let checkRole = await func.checkRole(superior, inferior, accountType);
    if (checkRole) {
      role_accounts.map(async (role_account) => {
        let maxIdrole = await func.maxID(Role);
        let new_roleUser = new Role({
          _id: maxIdrole + 1,
          id_user: inferior,
          account_type: accountType,
          role_admin: accountType == 0 ? 0 : 1,
          roleUser: role_account,
        });
        await new_roleUser.save();
      });
      return res.status(200).json({ message: "decentralize success" });
    }
    return res.status(400).json({ message: "function is not available" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.getListAdmin = async (req, res) => {
  try {
    const user_id = req.user.data._id;
    const accountType = req.user.data.accountType;
    const pageSize = req.query.pageSize || 10;
    const page = req.query.page || 1;
    const sort = req.query.sorts || -1; //  hoặc 1
    const email = req.query.email || "";
    const name = req.query.name || "";
    const code_role = req.query.code_role;

    if (accountType != 0) {
      return res.status(400).json({ message: "function is not valid" });
    }
    let list_admin = await Admin.aggregate([
      {
        $lookup: {
          from: "decentralizes",
          localField: "Admin_Dsecentralize",
          foreignField: "_id",
          as: "decentralizes",
        },
      },
      { $unwind: { path: "$decentralizes", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $and: [
            { Admin_email: { $regex: email?.toLowerCase() } },
            { Admin_name: { $regex: name || "" } },
            // { "$decentralizes.decentralize_code": code_role }
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          email: { $first: "$Admin_email" },
          name: { $first: "$Admin_name" },
          role: { $push: "$decentralizes" },
          status: { $first: "$status" },
        },
      },
      {
        $skip: Number(pageSize * (page - 1)),
      },
      { $limit: Number(pageSize) },
      {
        $sort: {
          name: Number(sort),
        },
      },
    ]);

    return res.status(200).json({
      data: {
        content: list_admin,
        page: page,
        size: pageSize,
        total_record: list_admin.length,
        total_page: parseInt(list_admin.length / pageSize + 1),
      },
      message: "OK",
    });
  } catch (err) {
    console.log(err);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};

exports.resetPassWord = async (req, res) => {
  try {
    user_id = req.user.data._id;
    accountType = req.user.data.accountType;
    client_id = req.body.id;
    new_pass = req.body.new_pass;
    console.log(user_id);
    console.log(client_id);
    if (Number(user_id) != Number(client_id)) {
      return res.status(400).json({ message: "fuction is not valid" });
    }
    let new_password = await bcrypt.hash(new_pass, 10);
    if (accountType == 0) {
      let info = await Admin.findOneAndUpdate(
        { _id: user_id },
        { Admin_password: new_password }
      );
      return res
        .status(200)
        .json({ data: info, message: "get info admin sucess" });
    } else if (accountType == 1 || accountType == 2) {
      let info = await Employee.findOneAndUpdate(
        { _id: user_id },
        { employeePassword: new_password }
      );

      return res
        .status(200)
        .json({ data: info, message: "get info employee success" });
    } else if (accountType == 3) {
      let info = await Hospital.findOneAndUpdate(
        { _id: user_id },
        { hospitalPassword: new_password }
      );

      return res
        .status(200)
        .json({ data: info, message: "get info Hospital success" });
    } else if (accountType == 4) {
      let info = await Customer.findOneAndUpdate(
        { _id: user_id },
        { Cutomer_password: new_password }
      );

      return res
        .status(200)
        .json({ data: info, message: "get info customer success" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.editProfile = async (req, res) => {
  try {
    let {
      userName,
      userType, //1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách  hàng
      userEmail,
      userPassword,
      userPhoneNumber,
      userBirthday,
      userGender, //1-nam ,2-nữ
      hopitalID,
    } = req.body;
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json({ data: info, message: "get info customer success" });
  }
};
