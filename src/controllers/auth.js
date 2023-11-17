const Employee = require("../models/Employee");
const Hospital = require("../models/Hospital");
const Customer = require("../models/Customer");
const func = require("../services/function");

exports.Register = async (req, res) => {
    try {


        let { userName,
            userType,//1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách  hàng  
            userEmail,
            userPassword,
            userPhoneNumber,
            userBirthday,
            userGender,//1-nam ,2-nữ
            hopitalID
        } = req.body;


        if (!userType || !userEmail || !userPassword || !userName) {
            res.status(500).json({ message: "input is not valid" });
            return;
        }

        let checkEmail = await func.checkEmail(userEmail);

        if (!checkEmail) {

            res.status(400).json({ message: "email is not valid" });
            return;
        }
        let checkPhone = await func.checkPhoneNumber(userPhoneNumber);

        if (!checkPhone) {
            res.status(404).json({ message: "phoneNumber is not valid" });
            return;
        }
        if (userType == 1 || userType == 2) {
            let checkExits = await Employee.exists({ employeeEmail: userEmail.toLowerCase() });
            if (checkExits) {
                return res.status(400).json({ message: "email already used" });
            }
            let maxId = await func.maxID(Employee);
            console.log("maxID Emp: ", maxId);
            const new_Employee = new Employee({
                _id: maxId + 1,
                employeeName: userName,
                employeeType: Number(userType),
                employeeEmail: userEmail.toLowerCase(),
                employeePassword: userPassword,
                employeePhone: userPhoneNumber,
                employeeBirthday: userBirthday,
                employeeGender: userGender,
                hopitalID: hopitalID,
                CreateAt: new Date()
            });


            await new_Employee.save().then(() => res.status(200).json({ message: "add employee success" }))
                .catch((err) => res.status(400).json({ message: err.message }));

        } else if (userType == 3) {
            let checkExits = await Hospital.exists({ hospitalEmail: userEmail.toLowerCase() });
            if (checkExits) {
                return res.status(400).json({ message: "email already used" });
            }
            let maxId = await func.maxID(Hospital);
            const new_Hospital = new Hospital({
                _id: maxId + 1,
                hospitalName: userName,
                hospitalEmail: userEmail.toLowerCase(),
                hospitalPassword: userPassword,
                hospitalPhone: userPhoneNumber,
                CreateAt: new Date(),
            });

            await new_Hospital.save()
                .then(() => res.status(200).json({ message: "add hospital success" }))
                .catch((err) => res.status(400).json({ message: err.message }));

        }
        else if (userType == 4) {
            let checkExits = await Customer.exists({ Customer_email: userEmail.toLowerCase() });
            if (checkExits) {
                return res.status(400).json({ message: "email already used" });
            }
            let maxId = await func.maxID(Customer);
            const new_Customer = new Customer({
                _id: maxId + 1,
                Customer_name: userName,
                Customer_email: userEmail.toLowerCase(),
                Cutomer_password: userPassword,
                Custome_phoneNumber: userPhoneNumber,
                CreateAt: new Date(),
            });

            await new_Customer.save()
                .then(() => res.status(200).json({ message: "add customer success" }))
                .catch((err) => res.status(400).json({ message: err.message }));


        } else {
            res.status(200).json({ message: "userType is not valid" });
        }

    } catch (err) {
        console.log("message: ", err.message);
        res.status(500).json({ message: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        let {
            email,
            password,
            userType//1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách  hàng 
        } = req.body;
        if (!userType || !email || !password) {
            res.status(500).json({ message: "input is not valid" });
            return;
        }
        //find by email and password
        //1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách  hàng 
        if (userType == 1 || userType == 2) {
            // let findUser = await Employee.aggregate(
            //     {
            //         $math: {
            //             employeeEmail: email.toLowerCase(),
            //             employeePassword: password
            //         }
            //     },
            //     // {
            //     //     $lookup: {
            //     //         from: 'Role',
            //     //         localField: 'role',
            //     //         foreignField: '_id',
            //     //         as: 'roleUser'

            //     //     }
            //     // },
            //     //    { $unwind: { path: '$roleUser', preserveNullAndEmptyArrays: true } }

            // );
            let findUser = await Employee.findOne({
                employeeEmail: email.toLowerCase(),
                employeePassword: password
            })
            //   console.log("user : ", findUser);
            if (!findUser) {
                res.status(400).json({ message: "email or password is not correct" });
                return;
            }
            let data = {
                _id: findUser._id,
                name: findUser.employeeName,
                identification: findUser.employeeIdentification,
                phone: findUser.employeePhone,
                address: findUser.employeeAddress,
                birthday: findUser.employeeBirthday,
                gender: findUser.employeeGender,
                // roleId: findUser.roleId,
            }
            let token = await func.createToken(data, '7d');
            console.log("token: ", token);

            res.status(200).json({ data: { token }, message: " employee login sucess" });
        }
        else if (userType == 3) {

            let findUser = await Hospital.findOne({
                hospitalEmail: email.toLowerCase(),
                hospitalPassword: password
            })
            //   console.log("user : ", findUser);
            if (!findUser) {
                res.status(400).json({ message: "email or password is not correct" });
                return;
            }
            let data = {
                _id: findUser._id,
                name: findUser.hospitalName,
                identification: findUser.hospitalIdentification,
                phone: findUser.hospitalPhone,
                address: findUser.hospitalAddress,
                //  birthday: findUser.employeeBirthday,
                //   gender: findUser.employeeGender,
                // roleId: findUser.roleId,
            }
            let token = await func.createToken(data, '7d');
            console.log("token: ", token);

            res.status(200).json({ data: { token }, message: " hospital login sucess" });
        }
        else if (userType == 4) {

            let findUser = await Customer.findOne({
                Customer_email: email.toLowerCase(),
                Cutomer_password: password
            })
            //   console.log("user : ", findUser);
            if (!findUser) {
                res.status(400).json({ message: "email or password is not correct" });
                return;
            }
            let data = {
                _id: findUser._id,
                name: findUser.Customer_name,
                identification: findUser.Custome_Identification,
                phone: findUser.Custome_phoneNumber,
                address: findUser.Custome_address,
                //  birthday: findUser.employeeBirthday,
                gender: findUser.Custome_gender,
                // roleId: findUser.roleId,
            }
            let token = await func.createToken(data, '7d');
            console.log("token: ", token);

            res.status(200).json({ data: { token }, message: " custommeer login sucess" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}