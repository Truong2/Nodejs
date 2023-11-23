const nodemailer = require("nodemailer");
require("dotenv").config()
exports.sendEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        port: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    //define email option
    const emailOption = {
        form: "CHAM SOC SUC KHOE",
        to: email,
        subject: email.subject,
        text: email.message
    }
    await transporter.sendMail(emailOption)


}