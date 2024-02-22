
const Role = require("../models/role");
const func = require("../services/function");
const bcrypt = require("bcryptjs");
const Decentralize = require("../models/decentralize");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError ");
const Users = require("../models/Users");
const Specialist = require("../models/Specialist");
const path = require('path');
const fs = require('fs');
const { log } = require("console");
require("dotenv").config();

exports.Register = async (req, res) => {
  try {
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
      // district,
      // ward,
      // province,
      specialist
    } = req.body;

    if (isNaN(userType) || !userEmail || !userPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request !", StatusCodes: StatusCodes.BAD_REQUEST });
    }

    userPassword = await bcrypt.hash(userPassword, 10);

    let checkEmail = await func.checkEmail(userEmail);
    if (!checkEmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email không hợp lệ !", StatusCodes: StatusCodes.BAD_REQUEST });
    }

    if (userPhoneNumber) {
      let checkPhone = await func.checkPhoneNumber(userPhoneNumber);
      if (!checkPhone) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Số điện thoại không hợp lệ !", StatusCodes: StatusCodes.BAD_REQUEST });
      }
    }

    if (decentralize && decentralize.length > 0) {
      const check_decentralize = await Decentralize.find({
        _id: { $in: decentralize },
      });
      if (check_decentralize.length != specialist.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Vai trò không hợp lệ !", StatusCodes: StatusCodes.BAD_REQUEST });
      }
    }
    if (specialist && specialist.length > 0) {
      const check_specialist = await Specialist.find({
        _id: { $in: specialist },
      });
      if (check_specialist.length != specialist.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Chuyên khoa không hợp lệ !", StatusCodes: StatusCodes.BAD_REQUEST });
      }
    }
    const user_id_max = await func.maxID(Users)

    const new_account = Users({
      _id: user_id_max + 1,
      type: userType,
      name: userName,
      email: userEmail.toLowerCase(),
      // district: district,
      // ward: ward,
      // province: province,
      password: userPassword,
      gender: userGender,
      hospitalId: hopitalID,
      DOB: userBirthday,
      decentrialize: decentralize || [],
      specialistId: specialist || []
    })
    await new_account.save()
      .then(() => {
        return res.status(StatusCodes.OK).json({ message: "Tạo tài khoản thành công.", StatusCodes: StatusCodes.OK });
      })

      .catch(err => {
        return res.status(StatusCodes.OK).json({ message: err, StatusCodes: StatusCodes.OK });
      })

  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message, StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

exports.login = async (req, res) => {
  try {
    let {
      email,
      password,
      userType, //0-admin 1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách hàng
    } = req.body;

    if (isNaN(userType) || !email || !password) {
      return res.status(404).json({ message: "Bad request !", statusCode: 400 });
    }

    let findUser = await Users.findOne({
      email: email.toLowerCase(),
    });
    if (!findUser) {
      return res.status(400).json({ message: "Email của bạn không đúng !", statusCode: 400 });
    }

    let check_password = await bcrypt.compare(
      password,
      findUser.password
    );
    if (!check_password) {
      return res.status(404).json({ message: "Mật khẩu của bạn không đúng !", statusCode: 400 });
    }

    let data = {
      _id: findUser._id,
      name: findUser.name,
      accountType: 0,
      createAt: findUser.createAt,
      decentralize: findUser.decentrialize,
      status: findUser.status,
      email: findUser.email,
    };
    
    let token = await func.createToken(data, "7d");

    return res.status(200).json({
      data: { token: token },
      message: " admin login sucess",
      statusCode: 200
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.InfoPerson = async (req, res) => {
  try {
    const { _id } = req.user.data;

    const info = await Users.aggregate([

      {
        $match: {
          _id: _id,
        },
      },
      {
        $lookup: {
          from: "decentralizes",
          localField: "decentrialize",
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
        $lookup: {
          from: "specialists",
          localField: "specialistId",
          foreignField: "_id",
          as: "Specialists",
        },
      },
      {
        $unwind: {
          path: "$Specialists",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          decentralizes: { $addToSet: "$Decentralize" },
          identification: { $first: "$identification" },
          phoneNumber: { $first: '$phoneNumber' },
          address: { $first: "$address" },
          status: { $first: "$status" },
          specialists: { $addToSet: "$Specialists" },
          birthday: { $first: "$DOB" },
          gender: { $first: "$gender" },
          experient: { $first: "$experient" },
          hospitalId: { $first: "$hospitalId" },
          startWorking: { $first: "$startWorking" },
          createAt: { $first: "$createAt" },
          avartar: { $first: "$avartar" },
          district: { $first: "$district" },
          ward: { $first: "$ward" },
          province: { $first: "$province" },
          type: { $first: "$type" }

        },
      },
    ]);
    if (!info) {
      return res.status(400).json({ message: "Không tìm thấy tài khoản !", statusCode: 400 });
    }
    return res
      .status(200)
      .json({ data: info[0], message: "ok", statusCode: 200 });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message, statusCode: 500 });
  }
};

exports.getInfoPerson = async (req, res) => {
  try {
    const user_id = Number(req.params.userId);

    if (isNaN(user_id) || (user_id) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Bad request !", statusCode: StatusCodes.BAD_REQUEST })
    }

    let info = await Users.aggregate([
      {
        $match: {
          _id: user_id,
        },
      },
      {
        $lookup: {
          from: "decentralizes",
          localField: "decentrialize",
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
        $lookup: {
          from: "specialists",
          localField: "specialistId",
          foreignField: "_id",
          as: "Specialists",
        },
      },
      {
        $unwind: {
          path: "$Specialists",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          decentralizes: { $addToSet: "$Decentralize" },
          identification: { $first: "$identification" },
          phoneNumber: { $first: '$phoneNumber' },
          address: { $first: "$address" },
          status: { $first: "$status" },
          specialists: { $addToSet: "$Specialists" },
          birthday: { $first: "$DOB" },
          gender: { $first: "$gender" },
          experient: { $first: "$experient" },
          hospitalId: { $first: "$hospitalId" },
          startWorking: { $first: "$startWorking" },
          createAt: { $first: "$createAt" },
          avartar: { $first: "$avartar" },
          district: { $first: "$district" },
          ward: { $first: "$ward" },
          province: { $first: "$province" },
          type: { $first: "$type" }

        },
      },
    ]);
    if (!info) {
      return res.status(400).json({ message: "Không tìm thấy tài khoản !", statusCode: 400 });
    }
    return res
      .status(200)
      .json({ data: info[0], message: "OK", statusCode: 200 });


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

    if (accountType != 0) {
      return res.status(400).json({ message: "function is not valid", statusCode: 400 });
    }

    let list_admin = await Users.aggregate([
      {
        $match: {
          $and: [
            { email: { $regex: email?.toLowerCase() } },
            { name: { $regex: name || "" } },
            { type: 0 }
          ],
        }
      },
      {
        $lookup: {
          from: "decentralizes",
          localField: "decentrialize",
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
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          decentralizes: { $addToSet: "$Decentralize" },
          identification: { $first: "$identification" },
          phoneNumber: { $first: '$phoneNumber' },
          address: { $first: "$address" },
          status: { $first: "$status" },
          specialists: { $addToSet: "$Specialists" },
          birthday: { $first: "$DOB" },
          gender: { $first: "$gender" },
          experient: { $first: "$experient" },
          hospitalId: { $first: "$hospitalId" },
          startWorking: { $first: "$startWorking" },
          createAt: { $first: "$createAt" },
          avartar: { $first: "$avartar" },
          district: { $first: "$district" },
          ward: { $first: "$ward" },
          province: { $first: "$province" },
          type: { $first: "$type" }
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

    total = await Users.find(
      {
        $and: [
          { email: { $regex: email?.toLowerCase() } },
          { name: { $regex: name || "" } },
          { type: 0 }
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

  const list_hospital = await Users.aggregate([
    {
      $match: {
        $and: [
          { name: { $regex: hospital_name } },
          { email: { $regex: email?.toLowerCase() } },
          { type: 3 }
        ]
      }
    },
    {
      $lookup: {
        from: "decentralizes",
        localField: "decentrialize",
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
        localField: "specialistId",
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
        name: { $first: "$name" },
        email: { $first: "$email" },
        decentralizes: { $addToSet: "$Decentralize" },
        identification: { $first: "$identification" },
        phoneNumber: { $first: '$phoneNumber' },
        address: { $first: "$address" },
        status: { $first: "$status" },
        specialists: { $addToSet: "$Specialists" },
        birthday: { $first: "$DOB" },
        gender: { $first: "$gender" },
        experient: { $first: "$experient" },
        hospitalId: { $first: "$hospitalId" },
        startWorking: { $first: "$startWorking" },
        createAt: { $first: "$createAt" },
        avartar: { $first: "$avartar" },
        district: { $first: "$district" },
        ward: { $first: "$ward" },
        province: { $first: "$province" },
        type: { $first: "$type" }
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
    }
  ])
  total = await Users.find({
    $and: [
      { name: { $regex: hospital_name } },
      { email: { $regex: email?.toLowerCase() } },
      { type: 3 },
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

  const list_employee = await User.aggregate([
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

exports.upload = async (req, res) => {
  try {
    const file = req.files.file;
    const currentFolderParent = path.join(__dirname, '..');
    // console.log(currentFolderParent);
    const path1 = path.join(currentFolderParent, 'static')

    const folder_avartar = path.join(path1, 'avatar')
    const save_path = path.join(folder_avartar, file.originalFilename.replace(" ", ""))
    console.log(save_path);

    if (!fs.existsSync(save_path)) {
      // Create the folder
      fs.mkdirSync(save_path);
    }

    fs.readFile(file.path, (err, data) => {
      if (err) {
        return res.status(400).json({ message: "fail" })
      }
      console.log('save_path', save_path);
      fs.writeFile(save_path, data, function (err) {
        if (err) {
          return res.status(400).json({ message: err })
        };
        console.log('Saved!');
      });
      // return res.status(200).json({ message: "OK" })



    });



  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json({ message: "get info customer success" });
  }

}

