"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const users_middleware_1 = require("../middleware/users.middleware");
const users_model_1 = __importDefault(require("../models/users.model"));
const registerUser = async (req, res) => {
    try {
        const { username } = req.body;
        const newUser = await users_model_1.default.create(req.body);
        const token = (0, users_middleware_1.generateToken)(newUser.username, newUser);
        res.status(201).json({
            status: "successful",
            token,
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
