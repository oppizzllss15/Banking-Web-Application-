"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.validateSignUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
