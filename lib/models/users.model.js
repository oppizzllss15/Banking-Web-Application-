"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userData = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        required: [true, "please enter your firstname"],
    },
    lastname: {
        type: String,
        required: [true, "please enter your lastname"],
    },
    username: {
        type: String,
        required: [true, "please enter a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
    },
    phonenumber: {
        type: Number,
        required: [true, "please enter your phone number"],
        unique: true,
    },
    "D.O.B": {
        type: Date,
        required: [true, "please enter your date of birth"],
    },
    address: {
        type: String,
        required: [true, "please enter your address"],
    },
    sex: {
        type: String,
        enum: ["male", "female"],
        required: [true, "please select a gender"],
    },
    user_status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },
    password: {
        type: String,
        required: [true, "please enter a password"],
    },
    "confirm password": {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("Users", userData);
exports.default = User;
