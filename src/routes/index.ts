import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();

import { registerUser } from "../controllers/users.controller";
import { validateSignUp } from "../middleware/users.middleware";

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "Ok",
    data: "Welcome to Dev Bank",
  });
});

router.post("/signup", validateSignUp, registerUser);

module.exports = router;
