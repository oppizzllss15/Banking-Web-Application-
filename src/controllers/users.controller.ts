import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import Users from "../models/users.model";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { sendEmail } from "../utils/email";
import User from "../models/users.model";
import { generateAccountNumber } from "./account.controller";
import BankAccount from "../models/account.model";
interface IUser {
  _id?: Types.ObjectId;
  firstname: String;
  lastname: String;
  username: String;
  email: String;
  phonenumber: Number;
  "Date of Birth": Date;
  address: String;
  gender?: String;
  user_status?: String;
  password?: String;
  passwordChanged?: Date;
  pin?: Number;
}

const generatePasswordResetToken = (user: IUser) => {
  let passwordResetToken;

  const payload = { id: user._id, email: user.email };

  if (process.env.PASSWORD_RESET_KEY) {
    passwordResetToken = jwt.sign(
      payload,
      `${process.env.PASSWORD_RESET_KEY + user.password}`,
      {
        expiresIn: process.env.PASSWORD_RESET_KEY_EXPIRES_IN,
      }
    );
  }
  return passwordResetToken;
};

const generateToken = (id: Object) => {
  if (process.env.SECRET_KEY) {
    const token = jwt.sign({ id }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN,
    });
    return token;
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const newUser: IUser = await Users.create(req.body);

    const accNum = generateAccountNumber(10);

    res.status(201).json({
      status: "successful",
      message: `User with username: ${username} successfully created`,
      data: {
        newUser,
      },
    });

    const userAccount = await BankAccount.create({
      "account owner": newUser._id,
      "account number": accNum,
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
      res.cookie("token", token);
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
    token,
    message: "Successfully logged out",
  });
  return;
};

const forgotPassword = async (req: Request, res: Response) => {
  // 1. Get users details from user object

  const { _id: id, email, password } = req.user;

  // 2. set payload
  const payload = {
    id,
    email,
  };

  // 3. add user password to env secret
  const secret = process.env.PASSWORD_RESET_KEY + password;

  // 4. set token
  const resetToken: string | undefined = jwt.sign(payload, secret, {
    expiresIn: process.env.PASSWORD_RESET_KEY_EXPIRES_IN,
  });

  // 5. Set reset url
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/devbank-user/reset-password/${id}/${resetToken}`;

  console.log(resetURL);

  // 6. deliver message
  const message = `Forgot your password? click on the link to reset your password. Link valid for 10 minutes.\n\n${resetURL}.\n\nWasn't you? Pls ignore this email.`;
  try {
    await sendEmail({
      email,
      subject: "Password Reset",
      message,
    });

    res.status(200).json({
      status: "Successful",
      message: "Check your email for the reset link",
    });
    return;
  } catch (err) {
    req.user.resetToken = undefined;
    await req.user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: "Failed",
      message: "There was an error sending the email. Pls try again later.",
    });
    return;
  }
};

const getResetPassword = async (req: Request, res: Response) => {
  const { id, token } = req.params;

  const user = await User.findById({ _id: id });

  if (user) {
    const secret = process.env.PASSWORD_RESET_KEY + user.password;

    try {
      const verifyToken = jwt.verify(token, secret);

      res.status(200).json({
        status: "Successful",
        message: "Enter your new password",
      });
      return;
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: `Invalid id: ${id}`,
    });
    return;
  }

  res.status(200).json({
    status: "Successful",
    message: `Welcome to password reset page.`,
    data: {
      id,
      token,
    },
  });
  return;
};

const resetPassword = async (req: Request, res: Response) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await User.findById({ _id: id });

  if (user) {
    const secret = process.env.PASSWORD_RESET_KEY + user.password;

    try {
      const verifyToken = jwt.verify(token, secret);

      const hashPassword = await bcrypt.hash(password, 12);

      await User.updateOne(
        { _id: id },
        { password: hashPassword, passwordChanged: Date.now() },
        {
          password: 0,
        }
      );

      res.status(200).json({
        status: "Successful",
        message: "Password successfully updated",
      });

      return;
    } catch (err) {
      res.status(400).json({
        status: "Failed",
        message: "Something went wrong",
      });
      return;
    }
  } else {
    res.status(400).json({
      status: "Failed",
      message: `Invalid id: ${id}`,
    });
    return;
  }
};

const updatePassword = async (req: Request, res: Response) => {
  const { "new password": newPassword, "confirm password": confirmPassword } =
    req.body;

  const genSalt = await bcrypt.genSalt(12);

  const hashPassword = await bcrypt.hash(newPassword, genSalt);

  const updateUser = await User.updateOne(
    { _id: req.user._id },
    { password: hashPassword, passwordChanged: Date.now() }
  );

  res.status(200).json({
    message: "You have successfully updated your password",
  });
  return;
};

export {
  generatePasswordResetToken,
  generateToken,
  registerUser,
  userLogin,
  userLogout,
  forgotPassword,
  getResetPassword,
  resetPassword,
  updatePassword,
};
