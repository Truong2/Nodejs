const Employee = require("../models/Employee");
const Hospital = require("../models/Hospital");
const Customer = require("../models/Customer");
const Specialist = require("../models/Specialist");
const Admin = require("../models//admin");
const Role = require("../models/role");
const func = require("../services/function");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
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

  if (userPhoneNumber) {
    let checkPhone = await func.checkPhoneNumber(userPhoneNumber);
    if (!checkPhone) {
      throw new ApiError(StatusCodes.NOT_FOUND, "phoneNumber is not valid");
    }
  }
  if (decentralize) {
    const check_decentralize = await Decentralize.find({
      _id: { $in: decentralize },
    });
    if (check_decentralize.length != decentralize.length) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "id decentralize is not valid");
    }
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
      Admin_Dsecentralize: decentralize ? decentralize : null,
      CreateAt: new Date(),
    });
    await new_Admin
      .save()
      .then(() => res.status(200).json({ message: "add admin success", statusCode: 200 }))
      .catch((err) => res.status(500).json({ message: err.message, statusCode: 500 }));
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
      employee_Dsecentralize: decentralize ? decentralize : null,
      CreateAt: new Date(),
    });

    await new_Employee
      .save()
      .then(() => res.status(200).json({ message: "add employee success", statusCode: 200 }))
      .catch((err) => res.status(500).json({ message: err.message, statusCode: 500 }));
  } else if (userType == 3) {
    let checkExits = await Hospital.exists({
      hospitalEmail: userEmail.toLowerCase(),
    });
    if (checkExits) {
      return res.status(400).json({ message: "email already used", statusCode: 400 });
    }
    let maxId_Hos = await func.maxID(Hospital);

    const new_Hospital = new Hospital({
      _id: maxId_Hos + 1,
      hospitalName: userName,
      hospitalEmail: userEmail.toLowerCase(),
      hospitalPassword: userPassword,
      hospitalPhone: userPhoneNumber,
      hospitalDsecentralize: decentralize ? decentralize : null,
      CreateAt: new Date(),
    });

    await new_Hospital
      .save()
      .then(() => res.status(200).json({ message: "add hospital success", statusCode: 200 }))
      .catch((err) => res.status(500).json({ message: err.message, statusCode: 500 }));
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
      Customer_Dsecentralize: decentralize ? decentralize : null,
      CreateAt: new Date(),
    });

    await new_Customer
      .save()
      .then(() => res.status(200).json({ message: "add customer success", statusCode: 200 }))
      .catch((err) => res.status(500).json({ message: err.message, statusCode: 500 }));
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

    if (typeof Number(userType) !== "number" || !email || !password) {
      return res.status(404).json({ message: "input is not valid", statusCode: 400 });
    }
    //find by email and password
    //0-admin1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách  hàng
    if (userType == 0) {
      let findUser = await Admin.findOne({
        Admin_email: email.toLowerCase(),
      });
      if (!findUser) {
        return res.status(400).json({ message: "email  is not correct", statusCode: 400 });
      }
      let check_password = await bcrypt.compare(
        password,
        findUser.Admin_password
      );
      if (!check_password) {
        return res.status(404).json({ message: "password is not valid", statusCode: 400 });
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
        .json({
          data: { token: token },
          message: " admin login sucess",
          statusCode: 200
        });
    } else if (userType == 1 || userType == 2) {
      let findUser = await Employee.findOne({
        employeeEmail: email.toLowerCase(),
      });
      if (!findUser) {
        return res.status(400).json({ message: "email  is not correct", statusCode: 400 });
      }
      let check_password = await bcrypt.compare(
        password,
        findUser.employeePassword
      );
      if (!check_password) {
        return res.status(400).json({ message: "password is not valid", statusCode: 400 });
      }
      let data = {
        _id: findUser._id,
        name: findUser.employeeName,
        hospital_id: findUser.hopitalID,
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
        .json({
          data: { token: token },
          message: " employee login sucess",
          statusCode: 200
        });
    } else if (userType == 3) {
      let findUser = await Hospital.findOne({
        hospitalEmail: email.toLowerCase(),
      });
      if (!findUser) {
        return res.status(400).json({ message: "email is not correct", statusCode: 400 });
      }
      let check_password = await bcrypt.compare(
        password,
        findUser.hospitalPassword
      );
      if (!check_password) {
        return res.status(404).json({ message: "password is not valid", statusCode: 400 });
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
        .json({ data: { token: token }, statusCode: 200, message: " hospital login sucess" });
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
        return res.status(400).json({ message: "password is not valid", statusCode: 400 });
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
        .json({ data: { token: token }, statusCode: 200, message: " custommeer login sucess" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.InfoPerson = async (req, res) => {
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
          $group: {
            _id: "$_id",
            name: { $first: "$Admin_name" },
            mail: { $first: "$Admin_email" },
            status: { $first: "$status" },
            area: { $first: "$Admin_area" },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists", statusCode: 400 });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info admin sucess", statusCode: 200 });

    } else if (accountType == 1 || accountType == 2) {
      let info = await Employee.aggregate([
        {
          $match: {
            $and: [
              { _id: Number(_id) },
              { employeeType: accountType }
            ]
          },
        },
        {
          $lookup: {
            from: "hospitals",
            localField: "hopitalID",
            foreignField: "_id",
            as: "hospitals",
          },
        },
        {
          $unwind: { path: "$hospitals", preserveNullAndEmptyArrays: true },
        },

        {
          $group: {
            _id: "$_id",
            name: { $first: "$employeeName" },
            email: { $first: "$employeeEmail" },
            phone: { $first: "$employeePhone" },
            address: { $first: "$employeeAddress" },
            birthday: { $first: "$employeeBirthday" },
            experience: { $first: "$employeeExperience" },
            hopitalId: { $first: "$hospitals.hospitalName" },
            status: { $first: "$employeeStatus" },
            practicingCertificateId: { $first: "$PracticingCertificateID" },
            practicingCertificateImg: { $first: "$UPracticingCertificateImg" },
            startWorking: { $first: "$ employeeStartWorking" },
            status: { $first: "$employeeStatus" },
            gender: { $first: "$employeeGender" }
          }
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists", statusCode: 400 });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info employee success", statusCode: 200 });
    } else if (accountType == 3) {
      let info = await Hospital.aggregate([
        {
          $match: {
            _id: _id,
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$hospitalName" },
            email: { $first: "$hospitalEmail" },
            phone: { $first: "$hospitalPhone" },
            address: { $first: "$hospitalAddress" },
            status: { $first: "$hopitalStatus" },
            hospitalIdentification: { $first: "$hospitalIdentification" },
            CreateAt: { $first: "$CreateAt" },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists", statusCode: 400 });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info Hospital success", statusCode: 200 });
    } else if (accountType == 4) {
      let info = await Customer.aggregate([
        {
          $match: {
            _id: _id,
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$Customer_name" },
            email: { $first: "$Customer_email" },
            phone: { $first: "$Customer_phoneNumber" },
            address: { $first: "$Customer_address" },
            status: { $first: "$hopitalStatus" },
            Identification: { $first: "$Customer_Identification" },
            gender: { $first: "$Customer_gender" },
            birthday: { $first: "$Customer_birthday" },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists", statusCode: 400 });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info customer success", statusCode: 200 });
    } else {
      return res
        .status(400)
        .json({ message: "you don't have permission to access this page", statusCode: 400 });
    }
  } catch (err) {
    {
      console.log(err);
      return res.status(500).json({ message: err.message, statusCode: 500 });
    }
  }
};

exports.getInfoPerson = async (req, res) => {

  try {
    const user_id = Number(req.params.userId);
    const acc_type = Number(req.params.typeAcc);

    if (
      isNaN(user_id) ||
      isNaN(acc_type) ||
      (user_id) <= 0 ||
      (acc_type) < 0 && acc_type > 4
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request !", statusCode: StatusCodes.BAD_REQUEST })
    } else if (user_id != "") {
      _id = Number(user_id);
      accountType = Number(acc_type)
    }

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
            localField: "Admin_Dsecentralize",
            foreignField: "_id",
            as: "Decentralize",
          },
        },
        {
          $unwind: {
            path: "$Decentralize",
            preserveNullAndEmptyArrays: true
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$Admin_name" },
            mail: { $first: "$Admin_email" },
            roleusers: { $push: "$Decentralize.decentralize_name" },
            area: { $first: "$Admin_area" },
            status: { $first: "$status" },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists", statusCode: 400 });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info admin sucess", statusCode: 200 });

    } else if (accountType == 1 || accountType == 2) {
      let info = await Employee.aggregate([
        {
          $match: {
            $and: [
              { _id: Number(_id) },
              { employeeType: accountType }
            ]
          },
        },
        {
          $lookup: {
            from: "decentralizes",
            localField: "employee_Decentralize",
            foreignField: "_id",
            as: "Decentralize",
          },
        },
        {
          $unwind: { path: "$Decentralize", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "hospitals",
            localField: "hopitalID",
            foreignField: "_id",
            as: "hospitals",
          },
        },
        {
          $unwind: { path: "$hospitals", preserveNullAndEmptyArrays: true },
        },

        {
          $group: {
            _id: "$_id",
            name: { $first: "$employeeName" },
            roleusers: { $push: "$Decentralize.decentralize_name" },
            email: { $first: "$employeeEmail" },
            phone: { $first: "$employeePhone" },
            address: { $first: "$employeeAddress" },
            birthday: { $first: "$employeeBirthday" },
            experience: { $first: "$employeeExperience" },
            hopitalId: { $first: "$hospitals.hospitalName" },
            status: { $first: "$employeeStatus" },
            type_account: { $first: "$employeeType" },
            practicingCertificateId: { $first: "$PracticingCertificateID" },
            practicingCertificateImg: { $first: "$UPracticingCertificateImg" },
            salary: { $first: "$ employeeSalary" },
            startWorking: { $first: "$ employeeStartWorking" },
            status: { $first: "$employeeStatus" },
            experience: { $first: "$employeeExperience" },
            certificateCreateAt: { $first: "$certificateCreateAt" },
            PracticingCertificateAdress: { $first: "$certificateCreateAt" },
            gender: { $first: "$employeeGender" }
          }
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists", statusCode: 400 });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info employee success", statusCode: 200 });
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
          $group: {
            _id: "$_id",
            name: { $first: "$hospitalName" },
            role: { $push: "$Decentralize.decentralize_name" },
            email: { $first: "$hospitalEmail" },
            phone: { $first: "$hospitalPhone" },
            address: { $first: "$hospitalAddress" },
            status: { $first: "$hopitalStatus" },
            type_account: { $first: accountType },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists", statusCode: 400 });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info Hospital success", statusCode: 200 });
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
          $group: {
            _id: "$_id",
            name: { $first: "$Customer_name" },
            roleusers: { $first: "$Decentralize.decentralize_name" },
            email: { $first: "$Customer_email" },
            phone: { $first: "$Customer_phoneNumber" },
            address: { $first: "$Customer_address" },
            status: { $first: "$hopitalStatus" },
            type_account: { $first: accountType },
          },
        },
      ]);
      if (!info) {
        return res.status(400).json({ message: "id user not exists", statusCode: 400 });
      }
      return res
        .status(200)
        .json({ data: info[0], message: "get info customer success", statusCode: 200 });
    } else {
      return res
        .status(400)
        .json({ message: "you don't have permission to access this page", statusCode: 400 });
    }
  } catch (err) {
    {
      console.log(err);
      return res.status(500).json({ message: err.message, statusCode: 500 });
    }
  }

}

exports.getListAdmin = async (req, res) => {
  try {
    const accountType = req.user.data.accountType;
    const pageSize = req.query.pageSize || 10;
    const page = req.query.page || 1;
    const sort = req.query.sorts || -1; //  hoặc 1
    const email = req.query.email || "";
    const name = req.query.name || "";
    const code_role = req.query.code_role;

    if (accountType != 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
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
      {
        $unwind: {
          path: "$decentralizes",
          preserveNullAndEmptyArrays: true
        }
      },
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
      {
        $limit: Number(pageSize)
      },
      {
        $sort: {
          name: Number(sort),
        },
      },
    ]);

    total = await Admin.find(
      {
        $and: [
          { Admin_email: { $regex: email?.toLowerCase() } },
          { Admin_name: { $regex: name || "" } },
        ],
      }).count()

    return res.status(200).json({
      data: {
        content: list_admin,
        page: page,
        size: pageSize,
        pageSize: list_admin.length,
        totalElement: total,
        total_page: parseInt(total / pageSize + 1),
      },
      message: "OK",
      statusCode: 200
    });
  } catch (err) {
    console.log(err);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};

exports.getListHospital = async (req, res) => {

  const hospital_name = req.query.hospital_name || "";
  const email = req.query.email || "";
  const page = req.query.page || 1;
  const sort = req.query.sort || -1;
  const pageSize = req.query.pageSize || 10;

  const list_hospital = await Hospital.aggregate([
    {
      $match: {
        $and: [
          { hospitalName: { $regex: hospital_name } },
          { hospitalEmail: { $regex: email?.toLowerCase() } },
        ]
      }
    },
    {
      $lookup: {
        from: "decentralizes",
        localField: "hospitalDsecentralize",
        foreignField: "_id",
        as: "decentralizes"
      }
    },
    {
      $unwind: {
        path: "$decentralizes",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "specialists",
        localField: "Specialist_ID",
        foreignField: "_id",
        as: "specialists"
      }
    },
    {
      $unwind: {
        path: "$specialists",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$hospitalName" },
        email: { $first: "$hospitalEmail" },
        identification: { $first: "$hospitalIdentification" },
        role: { $push: "$decentralizes" },
        specialist: { $push: "$specialists" },
        phone: { $first: "$hospitalPhone" },
        address: { $first: "$hospitalAddress" },
        practicingCertificateID: { $first: "$hos_PracticingCertificateID" },
        practicingCertificateImg: { $first: "$hos_PracticingCertificateImg" },
        status: { $first: "$hopitalStatus" }
      }
    },
    {
      $skip: Number(pageSize * (page - 1)),
    },
    {
      $limit: Number(pageSize)
    },
    {
      $sort: {
        name: Number(sort),
      },
    }
  ])
  total = await Hospital.find({
    $and: [
      { hospitalName: { $regex: hospital_name } },
      { hospitalEmail: { $regex: email?.toLowerCase() } },
    ]
  }).count()

  return res.status(StatusCodes.OK)
    .json({
      data: {
        content: list_hospital,
        page: page,
        size: pageSize,
        pageSize: list_hospital.length,
        totalElement: total,
        total_page: parseInt(total / pageSize + 1),

      },
      message: "success",
      statusCode: 200
    })

}

exports.getListEmployee = async (req, res) => {
  const user_login = req.user.data;

  const employee_name = req.query.hospital_name || "";
  const email = req.query.email || "";
  const page = req.query.page || 1;
  const sort = req.query.sort || -1;
  const pageSize = req.query.pageSize || 10;
  const typeAcc = req.query.typeAcc || null;

  if (user_login.accountType !== 0 && user_login.accountType !== 3) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Function is not valid", statusCode: StatusCodes.UNAUTHORIZED })
  }

  const condition = {}
  if (user_login.accountType == 3) {
    condition.hopitalID = user_login._id
  }
  if (typeAcc) {
    condition.employeeType = typeAcc
  }

  const list_employee = await Employee.aggregate([
    {
      $match: {
        $and: [
          { employeeName: { $regex: employee_name } },
          { employeeEmail: { $regex: email?.toLowerCase() } },
          { employeeType: 1 },
          condition
        ]
      }
    },
    {
      $lookup: {
        from: "decentralizes",
        localField: "employee_Decentralize",
        foreignField: "_id",
        as: "decentralizes"
      }
    },
    {
      $unwind: {
        path: "$decentralizes",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "hospitals",
        localField: "hopitalID",
        foreignField: "_id",
        as: "hospitals"
      }
    },
    {
      $unwind: {
        path: "$hospitals",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "specialists",
        localField: "SpecialistID",
        foreignField: "_id",
        as: "specialists"
      }
    },
    {
      $unwind: {
        path: "$specialists",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$employeeName" },
        type: { $first: "$employeeType" },
        email: { $first: "$employeeEmail" },
        hopital: { $first: "$hospitals.hospitalName" },
        identification: { $first: "$employeeIdentification" },
        specialist: { $addToSet: "$specialists.Specialist_Name" },
        role: { $addToSet: "$decentralizes.decentralize_name" },
        phone: { $first: "$employeePhone" },
        address: { $first: "$employeeAddress" },
        birthday: { $first: "$employeeBirthday" },
        practicingCertificateId: { $first: "$PracticingCertificateID" },
        practicingCertificateImg: { $first: "$UPracticingCertificateImg" },
        salary: { $first: "$ employeeSalary" },
        startWorking: { $first: "$ employeeStartWorking" },
        status: { $first: "$employeeStatus" },
        experience: { $first: "$employeeExperience" },
        certificateCreateAt: { $first: "$certificateCreateAt" },
        PracticingCertificateAdress: { $first: "$certificateCreateAt" },
        gender: { $first: "$employeeGender" }
      }
    },
    {
      $skip: Number(pageSize * (page - 1)),
    },
    {
      $limit: Number(pageSize)
    },
    {
      $sort: {
        name: Number(sort),
      },
    }
  ])
  total = await Employee.find({
    $and: [
      { employeeName: { $regex: employee_name } },
      { employeeEmail: { $regex: email?.toLowerCase() } },
      condition
    ]
  }).count()

  return res.status(StatusCodes.OK)
    .json({
      data: {
        content: list_employee,
        page: page,
        size: pageSize,
        pagesize: list_employee.length,
        totalElement: total,
        total_page: parseInt(total / pageSize + 1),
      },
      statusCode: 200,
      message: "success"
    })

}

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

