"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unavailableRoutes = void 0;
const unavailableRoutes = (req, res, next) => {
    res.status(404).json({
        status: "Failed",
        message: `The requested url: ${req.originalUrl}, was not found`,
    });
    return;
};
exports.unavailableRoutes = unavailableRoutes;
