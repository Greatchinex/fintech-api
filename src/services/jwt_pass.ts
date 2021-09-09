import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

// Generate jwt
export const jwtToken = (userId: string | number, isUser: boolean) => {
  return jwt.sign({ userId, isUser }, process.env.JWT_SECRET!, {
    expiresIn: "7d"
  });
};

// Hash Password
export const hashPass = async (password: string) => {
  return await argon2.hash(password);
};

// Verify password
export const verifyPass = async (
  current_password: string,
  password: string
): Promise<boolean> => {
  let cp = await argon2.verify(current_password, password);
  return cp;
};
