"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordHandler = exports.validateLogin = exports.validateSignUp = void 0;
const users_model_1 = __importDefault(require("../models/users.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validateSignUp = async (req, res, next) => {
    const { firstname, lastname, username, email, phonenumber, "Date of Birth": dob, address, gender, password, "confirm password": confirmPassword, } = req.body;
    if (!firstname ||
        !lastname ||
        !username ||
        !email ||
        !phonenumber ||
        !dob ||
        !address ||
        !gender ||
        !password ||
        !confirmPassword) {
        res.status(400).json({
            status: "Failed",
            message: "Please fill in all inputs then try again",
        });
        return;
    }
    next();
};
exports.validateSignUp = validateSignUp;
const validateLogin = async (req, res, next) => {
    const { username, password } = req.body;
    // 1. Check if the user entered both the email and password
    if (!username || !password) {
        res.status(401).json({
            status: "Failed",
            message: "Please input all fields and try again",
        });
        return;
    }
    // 2. Check if user exists
    const user = await users_model_1.default.findOne({ username });
    console.log(`i am being console logged: ${user}`);
    if (!user) {
        res.status(401).json({
            status: "Failed",
            message: "Username or password incorrect",
        });
        return;
    }
    // Check if user exists and passwords match
    if (user) {
        const verifyPassword = await bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!verifyPassword) {
            res.status(401).json({
                status: "Failed",
                message: "Username or password incorrect",
            });
            return;
        }
        else if (verifyPassword) {
            next();
        }
    }
};
exports.validateLogin = validateLogin;
const forgotPasswordHandler = async (req, res, next) => {
    const { email } = req.body;
    // 1. verify user exists
    const user = await users_model_1.default.findOne({ email });
    // 2. If user exists send reset token to user
    if (user) {
        req.user = user;
        next();
    }
    else
        res.status(404).json({
            status: "Failed",
            message: "Please check email and try again!",
        });
    return;
};
exports.forgotPasswordHandler = forgotPasswordHandler;
