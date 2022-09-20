import { Request, Response, NextFunction } from "express";

const unavailableRoutes = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "Failed",
    message: `The requested url: ${req.originalUrl}, was not found`,
  });
  return;
};

export { unavailableRoutes };
