import express, { Request, Response, NextFunction } from "express";
import Users from "../models/users.model";
import jwt from "jsonwebtoken";

const generateToken = (id: Object) => {
  if (process.env.SECRET_KEY) {
    const token = jwt.sign({ id }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN,
    });
    return token;
  }
};

const generateAccountNumber = (length: number) => {
  let num = "";
  for (let i = 0; i < length; i++) {
    num = num += parseInt((Math.random() * 10).toString());
  }

  const number = Number(num);
  return number;
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const newUser = await Users.create(req.body);

    res.status(201).json({
      status: "successful",
      message: `User with username: ${username} successfully created`,
      data: {
        newUser,
      },
    });

    return;
  } catch (err) {
    console.log(err);
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const user = await Users.findOne({ username }, { password: 0 });

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
  } catch (err) {
    console.log(err);
  }
};

const userLogout = async (req: Request, res: Response) => {
  let token = "";
  res.cookie("Id", "");
  res.status(200).json({
    status: "Successful",
    message: "Successfully logged out",
  });
};

const createAccountNumber = (req: Request, res: Response) => {
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

export { registerUser, userLogin, createAccountNumber, userLogout };
