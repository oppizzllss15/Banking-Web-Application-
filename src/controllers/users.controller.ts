import { verify } from "crypto";
import express, { Request, Response, NextFunction } from "express";
import { generateToken } from "../middleware/users.middleware";
import Users from "../models/users.model";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const newUser = await Users.create(req.body);

    const token = generateToken(newUser.username, newUser);

    res.status(201).json({
      status: "successful",
      token,
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



export { registerUser };
