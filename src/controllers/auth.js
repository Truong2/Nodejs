const Employee = require("../models/Employee");
const Hospital = require("../models/Hospital");
const Customer = require("../models/Customer");
const Admin = require("../models//admin");
const Role = require("../models/role");
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


        if (!userType || !userEmail || !userPassword) {
            return res.status(500).json({ message: "input is not valid" });

        }

        let checkEmail = await func.checkEmail(userEmail);

        if (!checkEmail) {

            return res.status(400).json({ message: "email is not valid" });

        }
        let checkPhone = await func.checkPhoneNumber(userPhoneNumber);

        if (!checkPhone) {
            return res.status(404).json({ message: "phoneNumber is not valid" });

        }
        if (userType == 0) {//admin
            let checkExits = await Admin.exists({ Admin_email: userEmail.toLowerCase() });
            if (checkExits) {
                return res.status(400).json({ message: "email already used" });
            }
            let maxId_admin = await func.maxID(Admin);
            let maxId_role = await func.maxID(Role);

            const role_admin = new Role({
                _id: maxId_role + 1,
                user_id: maxId_admin + 1,
                role_admin: 1,
                account_type: 0
            });
            await role_admin.save();

            const new_Admin = new Admin({
                _id: maxId_admin + 1,
                Admin_name: userName,
                Admin_email: userEmail.toLowerCase(),
                Admin_password: userPassword,
                employeePhone: userPhoneNumber,
                Admin_role: role_admin._id,
                CreateAt: new Date()
            });
            await new_Admin.save().then(() => res.status(200).json({ message: "add admin success" }))
                .catch((err) => res.status(400).json({ message: err.message }));

        }
        else if (userType == 1 || userType == 2) {
            let checkExits = await Employee.exists({ employeeEmail: userEmail.toLowerCase() });
            if (checkExits) {
                return res.status(400).json({ message: "email already used" });
            }


            let maxId_employee = await func.maxID(Employee);
            let maxId_role = await func.maxID(Role);

            let role = {};
            if (userType == 1) {
                role.role_doctor = 1;
                role._id = maxId_role + 1;
                role.user_id = maxId_employee + 1;
                role.account_type = 1;
            }
            if (userType == 2) {
                role.role_receptionist = 1;
                role._id = maxId_role + 1;
                role.user_id = maxId_employee + 1;
                role.account_type = 2;
            }

            const role_employee = new Role(role);
            await role_employee.save();

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
                role: role_employee._id,
                CreateAt: new Date()
            });


            await new_Employee.save().then(() => res.status(200).json({ message: "add employee success" }))
                .catch((err) => res.status(400).json({ message: err.message }));

        } else if (userType == 3) {
            let checkExits = await Hospital.exists({ hospitalEmail: userEmail.toLowerCase() });
            if (checkExits) {
                return res.status(400).json({ message: "email already used" });
            }
            let maxId_Hos = await func.maxID(Hospital);
            let maxId_role = await func.maxID(Role);

            const role_hos = new Role({
                _id: maxId_role + 1,
                user_id: maxId_Hos + 1,
                role_hospital: 1,
                account_type: 3
            });
            await role_hos.save();

            const new_Hospital = new Hospital({
                _id: maxId_Hos + 1,
                hospitalName: userName,
                hospitalEmail: userEmail.toLowerCase(),
                hospitalPassword: userPassword,
                hospitalPhone: userPhoneNumber,
                role: role_hos._id,
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
            let maxId_cus = await func.maxID(Customer);
            let maxId_role = await func.maxID(Role);

            const role_hos = new Role({
                _id: maxId_role + 1,
                user_id: maxId_cus + 1,
                role_customer: 1,
                account_type: 4
            });
            await role_hos.save();

            const new_Customer = new Customer({
                _id: maxId_cus + 1,
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
            userType//0-admin 1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách hàng 
        } = req.body;
        if (!userType || !email || !password) {
            res.status(404).json({ message: "input is not valid" });
            return;
        }
        //find by email and password
        //0-admin1- bác sĩ , 2 - lễ tân , 3 - cơ sở y tế ,4-khách  hàng 
        if (userType == 0) {
            let findUser = await Admin.findOne({
                Admin_email: email.toLowerCase(),
                Admin_password: password,
            })
            if (!findUser) {
                return res.status(400).json({ message: "email or password is not correct" });

            }
            let data = {
                _id: findUser._id,
                name: findUser.Admin_name,
                area: findUser.Admin_area,
                accountType: 0,
                createAt: findUser.CreateAt
            }

            let token = await func.createToken(data, '7d');


            let role = await Role.findOne({ user_id: findUser._id, account_type: 0 });


            res.status(200).json({ data: { token: token, role: role }, message: " employee login sucess" });
        }
        else if (userType == 1 || userType == 2) {

            let findUser = await Employee.findOne({
                employeeEmail: email.toLowerCase(),
                employeePassword: password,

            })

            if (!findUser) {
                return res.status(400).json({ message: "email or password is not correct" });

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
            }

            let token = await func.createToken(data, '7d');


            let role = await Role.findOne({ user_id: findUser._id, account_type: findUser.employeeType });


            res.status(200).json({ data: { token: token, role: role }, message: " employee login sucess" });
        }
        else if (userType == 3) {

            let findUser = await Hospital.findOne({
                hospitalEmail: email.toLowerCase(),
                hospitalPassword: password
            })

            if (!findUser) {
                res.status(400).json({ message: "email or password is not correct" });
                return;
            }
            let data = {
                _id: findUser._id,
                name: findUser.hospitalName,
                accountType: 3,
                identification: findUser.hospitalIdentification,
                phone: findUser.hospitalPhone,
                address: findUser.hospitalAddress,
                //  birthday: findUser.employeeBirthday,
                //   gender: findUser.employeeGender,
                // roleId: findUser.roleId,
            }
            let token = await func.createToken(data, '7d');

            let role = await Role.findOne({ user_id: findUser._id, account_type: 3 });

            res.status(200).json({ data: { token: token, role: role }, message: " hospital login sucess" });
        }
        else if (userType == 4) {

            let findUser = await Customer.findOne({
                Customer_email: email.toLowerCase(),
                Cutomer_password: password
            })

            if (!findUser) {
                res.status(400).json({ message: "email or password is not correct" });
                return;
            }
            let data = {
                _id: findUser._id,
                name: findUser.Customer_name,
                accountType: 4,
                identification: findUser.Custome_Identification,
                phone: findUser.Custome_phoneNumber,
                address: findUser.Custome_address,
                //  birthday: findUser.employeeBirthday,
                gender: findUser.Custome_gender,
                // roleId: findUser.roleId,
            }
            let token = await func.createToken(data, '7d');

            let role = await Role.findOne({ user_id: findUser._id, account_type: 4 });

            res.status(200).json({ data: { token: token, role: role }, message: " custommeer login sucess" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}


exports.getInfoPerson = async (req, res) => {
    let { _id, accountType } = req.user.data;
    try {

        if (accountType == 0) {
            let info = await Admin.findOne({ _id: _id });
            if (!info) {
                return res.status(400).json({ message: "id user not exists" })
            }
            return res.status(200).json({ data: info, message: "get info admin sucess" });
        } else if (accountType == 1 || accountType == 2) {
            let info = await Employee.findOne({ _id: _id });
            if (!info) {
                return res.status(400).json({ message: "id user not exists" })
            }
            return res.status(200).json({ data: info, message: "get info employee success" });
        } else if (accountType == 3) {
            let info = await Hospital.findOne({ _id: _id });
            if (!info) {
                return res.status(400).json({ message: "id user not exists" })
            }
            return res.status(200).json({ data: info, message: "get info Hospital success" });
        } else if (accountType == 4) {
            let info = await Customer.findOne({ _id: _id });
            if (!info) {
                return res.status(400).json({ message: "id user not exists" })
            }
            return res.status(200).json({ data: info, message: "get info customer success" });
        } else {
            return res.status(400).json({ message: "you don't have permission to access this page" })
        }

    } catch (err) {
        {
            console.log(err)
            return res.status(500).json({ message: err.message })
        }
    }


}