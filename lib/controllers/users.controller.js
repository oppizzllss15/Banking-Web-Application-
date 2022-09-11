"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.getResetPassword = exports.forgotPassword = exports.userLogout = exports.createAccountNumber = exports.userLogin = exports.registerUser = exports.generateToken = exports.generatePasswordResetToken = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_model_1 = __importDefault(require("../models/users.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const users_model_2 = __importDefault(require("../models/users.model"));
const generatePasswordResetToken = (user) => {
    let passwordResetToken;
    const payload = { id: user._id, email: user.email };
    if (process.env.PASSWORD_RESET_KEY) {
        passwordResetToken = jsonwebtoken_1.default.sign(payload, `${process.env.PASSWORD_RESET_KEY + user.password}`, {
            expiresIn: process.env.PASSWORD_RESET_KEY_EXPIRES_IN,
        });
    }
    return passwordResetToken;
};
exports.generatePasswordResetToken = generatePasswordResetToken;
const generateToken = (id) => {
    if (process.env.SECRET_KEY) {
        const token = jsonwebtoken_1.default.sign({ id }, process.env.SECRET_KEY, {
            expiresIn: process.env.EXPIRES_IN,
        });
        return token;
    }
};
exports.generateToken = generateToken;
const generateAccountNumber = (length) => {
    let num = "";
    for (let i = 0; i < length; i++) {
        num = num += parseInt((Math.random() * 10).toString());
    }
    const number = Number(num);
    return number;
};
const registerUser = async (req, res) => {
    try {
        const { username } = req.body;
        const newUser = await users_model_1.default.create(req.body);
        res.status(201).json({
            status: "successful",
            message: `User with username: ${username} successfully created`,
            data: {
                newUser,
            },
        });
        return;
    }
    catch (err) {
        console.log(err);
    }
};
exports.registerUser = registerUser;
const userLogin = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await users_model_1.default.findOne({ username }, { password: 0 });
        if (user) {
            const token = generateToken(user._id);
            res.cookie("Id", user._id);
            res.status(200).json({
                status: "Successful",
                token,
                message: `Welcome to Devs Bank ${username}`,
            });
            return;
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.userLogin = userLogin;
const userLogout = async (req, res) => {
    let token = "";
    res.cookie("Id", "");
    res.status(200).json({
        status: "Successful",
        token,
        message: "Successfully logged out",
    });
    return;
};
exports.userLogout = userLogout;
const createAccountNumber = (req, res) => {
    const accountNumber = generateAccountNumber(10);
    console.log(accountNumber);
    res.status(201).json({
        status: "Successful",
        message: "Account successfuly created",
        data: {
            accountNumber,
        },
    });
    return;
};
exports.createAccountNumber = createAccountNumber;
const forgotPassword = async (req, res) => {
    // 1. Get users details from user object
    const { _id: id, email, password } = req.user;
    // 2. set payload
    const payload = {
        id,
        email,
    };
    // 3. add user password to env secret
    const secret = process.env.PASSWORD_RESET_KEY + password;
    // 4. set token
    const resetToken = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: process.env.PASSWORD_RESET_KEY_EXPIRES_IN,
    });
    // 5. Set reset url
    const resetURL = `${req.protocol}://${req.get("host")}/devbank-user/reset-password/${id}/${resetToken}`;
    console.log(resetURL);
    // 6. deliver message
    const message = `Forgot your password? click on the link to reset your password. Link valid for 10 minutes.\n\n${resetURL}.\n\nWasn't you? Pls ignore this email.`;
    try {
        await (0, email_1.sendEmail)({
            email,
            subject: "Password Reset",
            message,
        });
        res.status(200).json({
            status: "Successful",
            message: "Check your email for the reset link",
        });
        return;
    }
    catch (err) {
        req.user.resetToken = undefined;
        await req.user.save({ validateBeforeSave: false });
        res.status(500).json({
            status: "Failed",
            message: "There was an error sending the email. Pls try again later.",
        });
        return;
    }
};
exports.forgotPassword = forgotPassword;
const getResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const user = await users_model_2.default.findById({ _id: id });
    if (user) {
        const secret = process.env.PASSWORD_RESET_KEY + user.password;
        try {
            const verifyToken = jsonwebtoken_1.default.verify(token, secret);
            res.status(200).json({
                status: "Successful",
                message: "Enter your new password",
            });
            return;
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        res.status(400).json({
            status: "Failed",
            message: `Invalid id: ${id}`,
        });
        return;
    }
    res.status(200).json({
        status: "Successful",
        message: `Welcome to password reset page.`,
        data: {
            id,
            token,
        },
    });
    return;
};
exports.getResetPassword = getResetPassword;
const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    const user = await users_model_2.default.findById({ _id: id });
    if (user) {
        const secret = process.env.PASSWORD_RESET_KEY + user.password;
        try {
            const verifyToken = jsonwebtoken_1.default.verify(token, secret);
            const hashPassword = await bcryptjs_1.default.hash(password, 12);
            await users_model_2.default.updateOne({ _id: id }, { password: hashPassword });
            res.status(200).json({
                status: "Successful",
                message: "Password successfully updated",
            });
            return;
        }
        catch (err) {
            res.status(400).json({
                status: "Failed",
                message: "Something went wrong",
            });
            return;
        }
    }
    else {
        res.status(400).json({
            status: "Failed",
            message: `Invalid id: ${id}`,
        });
        return;
    }
};
exports.resetPassword = resetPassword;
