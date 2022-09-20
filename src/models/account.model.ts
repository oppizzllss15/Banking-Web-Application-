import mongoose from "mongoose";
import { generateAccountNumber } from "../controllers/account.controller";
import User from "./users.model";

const acc = require("mongoose");

const account = new acc.Schema(
  {
    "account owner": { type: mongoose.Types.ObjectId, ref: "User" },
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
  },
  { timestamps: true }
);

const BankAccount = acc.model("AccountNumber", account);

export default BankAccount;
