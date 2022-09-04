import { userLogin } from "../controllers/users.controller";
import { validateLogin } from "../middleware/users.middleware";

const express = require("express");
const router = express.Router();

router.post("/login", validateLogin, userLogin);

module.exports = router;
