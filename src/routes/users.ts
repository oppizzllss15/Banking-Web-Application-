import {
  createAccountNumber,
  forgotPassword,
  userLogin,
  userLogout,
  resetPassword,
  getResetPassword,
} from "../controllers/users.controller";
import { validateToken } from "../middleware/tokenAuth";
import {
  forgotPasswordHandler,
  resetPasswordHandler,
  validateLogin,
} from "../middleware/users.middleware";

const express = require("express");
const router = express.Router();

// user root = "/devbank-user"

router.get("/reset-password/:id/:token", getResetPassword);
router.post("/logout", userLogout);
router.post("/login", validateLogin, userLogin);
router.post("/create-account", validateToken, createAccountNumber);
router.post("/forgot-password", forgotPasswordHandler, forgotPassword);
router.post("/reset-password/:id/:token", resetPasswordHandler, resetPassword);

module.exports = router;
