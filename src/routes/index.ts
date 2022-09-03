import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "Ok",
    data: "Welcome to Dev Bank",
  });
});

module.exports = router;
