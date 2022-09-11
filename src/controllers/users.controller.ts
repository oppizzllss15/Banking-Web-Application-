import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import Users from "../models/users.model";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { sendEmail } from "../utils/email";
import User from "../models/users.model";
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
    token,
    message: "Successfully logged out",
  });
  return;
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

      await User.updateOne({_id: id}, {password: hashPassword});

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

export {
  generatePasswordResetToken,
  generateToken,
  registerUser,
  userLogin,
  createAccountNumber,
  userLogout,
  forgotPassword,
  getResetPassword,
  resetPassword,
};
