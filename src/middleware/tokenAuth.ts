import { promisify } from "util";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.model";
import mongoose from "mongoose";

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    // 1. Check if token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "Failed",
        message: "You need to be logged in to access this route.",
      });
      return;
    }

    // 2. Verify the authenticity of the token & confirm the user exists
    let verified;
    if (process.env.SECRET_KEY) {
      verified = jwt.verify(token, process.env.SECRET_KEY);

      if (verified instanceof Object) {
        const currentUser = await User.findOne(
          { _id: verified.id },
          { password: 0 }
        );

        console.log(currentUser);
        if (!currentUser) {
          res.status(401).json({
            status: "Failed",
            message: "The User assigned to this token doesn't exist",
          });
          return;
        }

        // 3. Check if user hasnt changed passwords
        if (currentUser.changedPassword(verified.iat)) {
          res.status(401).json({
            status: "Failed",
            message: "Password recently changed, please log in again.",
          });
          return;
        }

        req.user = currentUser;
        next();
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export { validateToken };
