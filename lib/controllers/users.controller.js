"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.userLogout = exports.createAccountNumber = exports.userLogin = exports.registerUser = exports.generateToken = void 0;
const users_model_1 = __importDefault(require("../models/users.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        message: "Successfully logged out",
    });
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
