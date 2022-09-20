"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_controller_1 = require("../controllers/account.controller");
const users_controller_1 = require("../controllers/users.controller");
const tokenAuth_1 = require("../middleware/tokenAuth");
const users_middleware_1 = require("../middleware/users.middleware");
const express = require("express");
const router = express.Router();
// user root = "/devbank-user"
router.get("/reset-password/:id/:token", users_controller_1.getResetPassword);
router.post("/logout", users_controller_1.userLogout);
router.post("/login", users_middleware_1.validateLogin, users_controller_1.userLogin);
// router.post("/create-account", validateToken, createAccountNumber);
router.post("/forgot-password", users_middleware_1.forgotPasswordHandler, users_controller_1.forgotPassword);
router.post("/reset-password/:id/:token", users_middleware_1.resetPasswordHandler, users_controller_1.resetPassword);
router.post("/update-password", tokenAuth_1.validateToken, users_middleware_1.updatePasswordHandler, users_controller_1.updatePassword);
router.post("/transfer", tokenAuth_1.validateToken, account_controller_1.transferAmount);
module.exports = router;
