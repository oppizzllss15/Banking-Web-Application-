"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const users_controller_1 = require("../controllers/users.controller");
const users_middleware_1 = require("../middleware/users.middleware");
router.get("/", (req, res) => {
    res.status(200).json({
        status: "Ok",
        data: "Welcome to Dev Bank",
    });
});
router.post("/signup", users_middleware_1.validateSignUp, users_controller_1.registerUser);
module.exports = router;
