import express, { Request, Response, NextFunction } from "express";
import Users from "../models/users.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generatePasswordResetToken } from "../controllers/users.controller";

const validateSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstname,
    lastname,
    username,
    email,
    phonenumber,
    "Date of Birth": dob,
    address,
    gender,
    password,
    "confirm password": confirmPassword,
  } = req.body;

  if (
    !firstname ||
    !lastname ||
    !username ||
    !email ||
    !phonenumber ||
    !dob ||
    !address ||
    !gender ||
    !password ||
    !confirmPassword
  ) {
    res.status(400).json({
      status: "Failed",
      message: "Please fill in all inputs then try again",
    });
    return;
  }
  next();
};

const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  // 1. Check if the user entered both the email and password
  if (!username || !password) {
    res.status(401).json({
      status: "Failed",
      message: "Please input all fields and try again",
    });
    return;
  }

  // 2. Check if user exists
  const user = await Users.findOne({ username });

  if (!user) {
    res.status(401).json({
      status: "Failed",
      message: "Username or password incorrect",
    });
    return;
  }

  // Check if user exists and passwords match
  if (user) {
    const verifyPassword = await bcrypt.compare(password, user?.password);
    if (!verifyPassword) {
      res.status(401).json({
        status: "Failed",
        message: "Username or password incorrect",
      });
      return;
    } else if (verifyPassword) {
      next();
    }
  }
};

const forgotPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  // 1. verify user exists
  const user = await Users.findOne({ email });

  // 2. If user exists send reset token to user
  if (user) {
    req.user = user;
    next();
  } else
    res.status(404).json({
      status: "Failed",
      message: "Please check email and try again!",
    });
  return;
};

const resetPasswordHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, "confirm password": confirmPassword } = req.body;
  console.log(password);
  console.log(confirmPassword);
  if (!password || !confirmPassword) {
    res.status(400).json({
      status: "Failed",
      message: "input both fields",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      status: "Failed",
      message: "Passwords dont match",
    });
    return;
  }

  next();
};

export {
  validateSignUp,
  validateLogin,
  forgotPasswordHandler,
  resetPasswordHandler,
};
