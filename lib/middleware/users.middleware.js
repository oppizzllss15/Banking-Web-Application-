"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.generateToken = exports.validateSignUp = void 0;
const users_model_1 = __importDefault(require("../models/users.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken = (username, user) => {
    if (process.env.SECRET_KEY) {
        const token = jsonwebtoken_1.default.sign({ username: user.username }, process.env.SECRET_KEY, {
            expiresIn: process.env.EXPIRES_IN,
        });
        return token;
    }
};
exports.generateToken = generateToken;
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
    if (!username || !password) {
        res.status(401).json({
            status: "Failed",
            message: "Please enter both fields",
        });
        return;
    }
    const user = await users_model_1.default.findOne({ username });
    if (!user) {
        res.status(401).json({
            status: "Failed",
            message: "Username or password incorrect",
        });
        return;
    }
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
