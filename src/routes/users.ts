import {
  createAccountNumber,
  forgotPassword,
  userLogin,
  userLogout,
} from "../controllers/users.controller";
import { validateToken } from "../middleware/tokenAuth";
import {
  forgotPasswordHandler,
  validateLogin,
} from "../middleware/users.middleware";

const express = require("express");
const router = express.Router();

// user root = "/devbank-user"

router.post("/logout", userLogout);
router.post("/login", validateLogin, userLogin);
router.post("/create-account", validateToken, createAccountNumber);
router.post("/forgot-password", forgotPasswordHandler, forgotPassword);
// router.post("/reset-password", resetPasswordHandler, resetPassword);

module.exports = router;
