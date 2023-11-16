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
            userGender,
            hopitalID
        } = req.body;

        if (!userType || !userEmail || !userPassword || !userName) {
            res.status(500).json({ message: "input is not valid" });
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
                employeeType: userType,
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