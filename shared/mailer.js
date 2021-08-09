import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config()
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
const USER = process.env.MAIL_USERNAME;

const accessToken = await oAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
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