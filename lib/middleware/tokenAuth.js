"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_model_1 = __importDefault(require("../models/users.model"));
const validateToken = async (req, res, next) => {
    try {
        let token;
        // 1. Check if token exists
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({
                status: "Failed",
                message: "You need to be logged in to access this route.",
            });
            return;
        }
        // 2. Verify the authenticity of the token & confirm the user exists
        let verified;
        if (process.env.SECRET_KEY) {
            verified = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            if (verified instanceof Object) {
                const currentUser = await users_model_1.default.findOne({ _id: verified.id }, { password: 0 });
                if (!currentUser) {
                    res.status(401).json({
                        status: "Failed",
                        message: "The User assigned to this token doesn't exist",
                    });
                    return;
                }
                // 3. Check if user hasnt changed passwords
                if (currentUser.changedPassword(verified.iat)) {
                    res.status(401).json({
                        status: "Failed",
                        message: "Password recently changed, please log in again.",
                    });
                    return;
                }
                req.user = currentUser;
                next();
            }
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.validateToken = validateToken;
