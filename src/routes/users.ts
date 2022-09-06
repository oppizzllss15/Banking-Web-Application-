import {
  createAccountNumber,
  userLogin,
  userLogout,
} from "../controllers/users.controller";
import { validateToken } from "../middleware/tokenAuth";
import { validateLogin } from "../middleware/users.middleware";

const express = require("express");
const router = express.Router();

router.post("/logout", userLogout);
router.post("/login", validateLogin, userLogin);
router.post("/create-account", validateToken, createAccountNumber);
router.post('/forgot-password')

module.exports = router;
