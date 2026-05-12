import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secret_key");

    (req as any).user = decoded;
    
    //improvement - 
    // const decoded = jwt.verify(token, "secret_key") as any;

    // req.user = {
    //     userId: decoded.userId,
    //     email: decoded.email,
    // };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};