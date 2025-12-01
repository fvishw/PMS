import type { NextFunction,Request,Response } from "express";
import AuthService from "../utils/AuthService.ts";

const authMiddleware = (allowedRoles: string[]) => {
  // Authentication logic here
    return (req:Request, res:Response, next:NextFunction) => {
        
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const payload = AuthService.verifyToken(token);
        if (!payload) {
            return res.status(401).json({ message: "Invalid token" });
        }

        if (allowedRoles.includes(payload.role)) {
            req.user = payload;
            next();
        } 

    };
};

export default authMiddleware;