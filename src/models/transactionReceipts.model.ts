import { timeStamp } from "console";
import transaction from "mongoose";

const transactionSchema = new transaction.Schema(
  {
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
  },
  { timestamps: true }
);

const Transactions = transaction.model(
  "Transaction-Details",
  transactionSchema
);

export default Transactions;
