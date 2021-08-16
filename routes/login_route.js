import express from 'express';
import jwt from 'jsonwebtoken';
import bycrpt from 'bcryptjs';
import crypto from "crypto";
import { loginModel } from '../database/model.js';
import { signinValidation, signupValidation } from '../shared/validation.js';
import { activateMail, resetMail } from '../shared/mailer.js';

const loginRouter = express.Router();

// Creating Account 
loginRouter.route("/signup")
    .get(async (req, res) => {
        const data = await loginModel.find({})
        res.send(data);
    })
    .post(async (req, res) => {
        let { email, name, password } = req.body;
        try {
            const { error } = signupValidation(req.body);
            if (error) return res.status(401).json({ message: error.details[0].message });
            const IsExist = await loginModel.findOne({ email })
            if (IsExist) return res.status(406).json({ message: "Email  Already Exists" });
            const salt = await bycrpt.genSalt(12);
            password = await bycrpt.hash(req.body.password, salt);
            crypto.randomBytes(32, async (err, buffer) => {
                if (err) console.log(err)
                const token = buffer.toString("hex");
                const result = new loginModel({ email, password, name, resettoken: token, expiretoken: Date.now() + 1200000 });
                await result.save();
                const mail = await activateMail(email, token);
                if (!mail) return res.status(409).json({ message: "Something went wrong, Make sure you entered valid email" })
                res.status(200).json({ message: "Please Check the mail to activate the account (including spam folder)" })
            })
        } catch (error) {
            res.send(error)
        }
    })
loginRouter
    .route("/signup/:id")
    .delete(async (req, res) => {
        const { id } = req.params;
        const data = await loginModel.findByIdAndRemove(id);
        res.json({ message: "Deleted Successfully", data })
    })

// Activating Account
loginRouter
    .route("/activate")
    .post(async (req, res) => {
        const { token } = req.body
        const user = await loginModel.findOne({ resettoken: token, expiretoken: { $gt: Date.now() } })
        if (!user) {
            await loginModel.findOneAndRemove({ resettoken: token })
            return res.status(408).json({ message: "Request Timeout Please create your account again" })
        }
        user.active = true;
        user.resettoken = undefined;
        user.expiretoken = undefined;
        user.save();
        res.status(200).json({ message: "Your Account is activated Successfully" })
    })
// Login for Account
loginRouter
    .route("/signin")
    .post(async (req, res) => {
        const { email, password } = req.body;
        const maxAge = 3 * 24 * 60 * 60;
        try {
            const { error } = signinValidation(req.body);
            if (error) return res.status(401).json({ message: error.details[0].message });
            const user = await loginModel.findOne({ email })
            if (!user) return res.status(404).json({ message: "User doesn't Exists" })
            if (!user.active) return res.status(406).json({ message: "Please check your mail and Activate your account" })
            const isPasswordCorrect = await bycrpt.compare(password, user.password);
            if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });
            const token = jwt.sign({ email: user.email, id: user._id }, "url user", { expiresIn: maxAge })
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, secure: true })
            res.status(200).json({ message: "Login Successfull", token, data: user })
        } catch (error) {
            res.send(error)
        }
    })

// Forget Password
loginRouter
    .route("/forgot")
    .post(async (req, res) => {
        const { email } = req.body;
        try {
            crypto.randomBytes(32, async (err, buffer) => {
                if (err) console.log(err)
                const token = buffer.toString("hex");
                const isExists = await loginModel.findOne({ email });
                if (!isExists) return res.status(404).json({ message: "User doesn't Exists" })
                isExists.resettoken = token;
                isExists.expiretoken = Date.now() + 1200000;
                await isExists.save();
                const mail = await resetMail(email, token);
                if (!mail) return res.status(409).json({ message: "Something went wrong" })
                res.status(200).json({ message: "Please Check the mail to reset your password (check spam folder also)" })
            })
        } catch (error) {

        }
    })
// Password Reset
loginRouter
    .route("/reset")
    .post(async (req, res) => {
        const { token, password } = req.body;
        try {
            const user = await loginModel.findOne({ resettoken: token, expiretoken: { $gt: Date.now() } })
            if (!user) return res.status(408).json({ message: "Request Timeout Please Try again Later" })
            const salt = await bycrpt.genSalt(12);
            const hashedpassword = await bycrpt.hash(password, salt);
            user.password = hashedpassword;
            user.resettoken = undefined;
            user.expiretoken = undefined;
            await user.save()
            res.status(200).json({ message: "Password is updated Successfully" })
        } catch (error) {
            res.send(error)
        }
    })

export { loginRouter }