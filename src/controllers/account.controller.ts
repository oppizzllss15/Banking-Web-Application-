import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import BankAccount from "../models/account.model";
import Transactions from "../models/transactionReceipts.model";

const generateAccountNumber = (length: number) => {
  let num = "";
  for (let i = 0; i < length; i++) {
    num = num += parseInt((Math.random() * 10).toString());
  }

  const number = Number(num);
  return number;
};

const transferAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    "receiver account": receiverAccount,
    amount,
    pin,
    narration,
  } = req.body;
  const { _id: senderID } = req.user;

  //remember to validate user pin
  if (pin !== req.user.pin) {
    res.status(400).json({
      status: "failed",
      message: "Incorrect transaction pin",
    });
    return;
  }

  const checkSender = await BankAccount.findOne({
    "account owner": senderID,
  });

  const checkReceiver = await BankAccount.findOne({
    "account number": receiverAccount,
  });

  if (checkSender && checkReceiver && checkSender.balance > amount) {
    const newSenderBalance = checkSender.balance - amount;
    const newReceiverBalance = checkReceiver.balance + amount;

    await BankAccount.findOneAndUpdate(
      { "account owner": senderID },
      { balance: newSenderBalance }
    );
    await BankAccount.findOneAndUpdate(
      { "account number": receiverAccount },
      { balance: newReceiverBalance }
    );

    const receipt = {
      "reference number": uuidv4().slice(0, 18),
      "sender account": checkSender["account number"],
      amount,
      "receiver account": receiverAccount,
      narration,
    };

    await Transactions.create(receipt);
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
export { generateAccountNumber, transferAmount };
