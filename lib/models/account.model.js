"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const acc = require("mongoose");
const account = new acc.Schema({
    "account owner": { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    "account number": {
        type: Number,
        unique: true,
    },
    balance: {
        type: Number,
        default: 5000,
    },
    denomination: {
        type: String,
        enum: ["USD", "EUR", "GBP", "CAD"],
        default: "USD",
        required: [true, "Please select a denomination"],
    },
}, { timestamps: true });
const BankAccount = acc.model("AccountNumber", account);
exports.default = BankAccount;
