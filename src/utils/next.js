const nodemailer = require("nodemailer");
require("dotenv").config()
const sendEmail = async (email) => {
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

exports.resetToken = async (req, user, next) => {
    try {
        const resetToken = crypto.randomBytes(32).toString('hex');
        crypto.createHash('sha256').update(resetToken).digest('hex');

        const resetUrl = `${req.protocol}:://${req.get("host")}/api/v1/user/resetPassword/${resetToken} `
        const message = `We have received a password request.Please use the below link to reset your password\n\n ${resetUrl}\n\nThis reset password link be valid only 10 minutes.`

        await sendEmail({
            email: user.email,
            subject: "password change request received",
            message: message
        })
        return resetToken;

    } catch (err) {
        console.log(err)
        return next()
    }




}