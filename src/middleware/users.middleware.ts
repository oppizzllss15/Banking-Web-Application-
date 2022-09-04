import express, { Request, Response, NextFunction } from "express";
import Users from "../models/users.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (username: String, user: IUser) => {
  if (process.env.SECRET_KEY) {
    const token = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );
    return token;
  }
};

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



export { validateSignUp, generateToken};