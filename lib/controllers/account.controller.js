"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferAmount = exports.generateAccountNumber = void 0;
const uuid_1 = require("uuid");
const account_model_1 = __importDefault(require("../models/account.model"));
const transactionReceipts_model_1 = __importDefault(require("../models/transactionReceipts.model"));
const generateAccountNumber = (length) => {
    let num = "";
    for (let i = 0; i < length; i++) {
        num = num += parseInt((Math.random() * 10).toString());
    }
    const number = Number(num);
    return number;
};
exports.generateAccountNumber = generateAccountNumber;
const transferAmount = async (req, res, next) => {
    const { "receiver account": receiverAccount, amount, pin, narration, } = req.body;
    const { _id: senderID } = req.user;
    //remember to validate user pin
    if (pin !== req.user.pin) {
        res.status(400).json({
            status: "failed",
            message: "Incorrect transaction pin",
        });
        return;
    }
    const checkSender = await account_model_1.default.findOne({
        "account owner": senderID,
    });
    const checkReceiver = await account_model_1.default.findOne({
        "account number": receiverAccount,
    });
    if (checkSender && checkReceiver && checkSender.balance > amount) {
        const newSenderBalance = checkSender.balance - amount;
        const newReceiverBalance = checkReceiver.balance + amount;
        await account_model_1.default.findOneAndUpdate({ "account owner": senderID }, { balance: newSenderBalance });
        await account_model_1.default.findOneAndUpdate({ "account number": receiverAccount }, { balance: newReceiverBalance });
        const receipt = {
            "reference number": (0, uuid_1.v4)().slice(0, 18),
            "sender account": checkSender["account number"],
            amount,
            "receiver account": receiverAccount,
            narration,
        };
        await transactionReceipts_model_1.default.create(receipt);
        res.status(200).json({
            status: "Successful",
            message: "Transaction completed succsessfully",
            data: {
                receipt,
            },
        });
        return;
    }
};
exports.transferAmount = transferAmount;
