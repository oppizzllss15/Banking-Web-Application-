"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: true,
    },
    phonenumber: {
        type: Number,
        required: [true, "please enter your phone number"],
        unique: true,
    },
    "Date of Birth": {
        type: Date,
        required: [true, "please enter your date of birth"],
    },
    address: {
        type: String,
        required: [true, "please enter your address"],
    },
    gender: {
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
    passwordChanged: {
        type: Date,
    },
    resetToken: {
        type: String,
    }
}, {
    timestamps: true,
});
// document middleware pre hook to hash password
userData.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    this["confirm password"] = undefined;
    next();
});
// instance method to compare passwords
userData.methods.checkPassword = async function (enteredPasswored, storedPassword) {
    return await bcryptjs_1.default.compare(enteredPasswored, storedPassword);
};
// instance method checking if password changed time stamps
userData.methods.changedPassword = function (JWTTimestamp) {
    if (this.passwordChanged) {
        const initialTS = Number(this.passwordChanged.getTime());
        const changedTimestamp = initialTS / 1000;
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
const User = mongoose_1.default.model("Users", userData);
exports.default = User;
