import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const headers = req.headers.authorization;

    if (!headers) {
      // Call the catch block
      throw new Error();
    }

    const headerValue = headers.split(" ");
    const token = headerValue[1];

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decodedToken;

    return next();
  } catch (err) {
    return res.json({
      message: "Not authorized, Please login again",
      success: false
    });
  }
};
