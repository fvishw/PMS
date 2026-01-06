import type { NextFunction, Request, Response } from "express";
import AuthService from "@/utils/AuthService.js";

const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const payload = AuthService.verifyToken(token);

      if (!allowedRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = payload;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
export default authMiddleware;
