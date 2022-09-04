"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("../controllers/users.controller");
const users_middleware_1 = require("../middleware/users.middleware");
const express = require("express");
const router = express.Router();
router.post("/login", users_middleware_1.validateLogin, users_controller_1.userLogin);
module.exports = router;
