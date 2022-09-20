"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    "reference number": {
        type: String,
    },
    "sender account": {
        type: Number,
    },
    amount: {
        type: Number,
    },
    "receiver account": {
        type: Number,
    },
    narration: {
        type: String,
    },
}, { timestamps: true });
const Transactions = mongoose_1.default.model("Transaction-Details", transactionSchema);
exports.default = Transactions;
