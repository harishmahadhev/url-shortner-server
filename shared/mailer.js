import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()
const USER = process.env.MAIL_USERNAME;
const PASSWORD = process.env.MAIL_PASSWORD;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: USER,
        pass: PASSWORD
    }
})
export async function activateMail(email, token) {
    try {
        const mailOptions = {
            from: `Harish 😎 <${USER}>`,
            to: email,
            subject: "Account Activation",
            html: `<h3>Activate your account to use the URL-Shortner Service</h3><h4>Please click the <a href="${process.env.BASEURL}/activate/${token}">Link</a> to activate your account</h4>`
        }
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}

export async function resetMail(email, token) {
    try {
        const mailOptions = {
            from: `Harish 😎 <${USER}>`,
            to: email,
            subject: "Password Reset",
            html: `<h3>Reset your Password</h3><h4>Please click the <a href="${process.env.BASEURL}/reset/${token}">Link</a> to reset your password</h4>`
        }
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}