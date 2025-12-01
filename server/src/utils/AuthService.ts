import jwt from "jsonwebtoken";
import type { Types } from "mongoose";

type TokenType = "access" | "refresh";
interface TokenPayload {
  id: string | Types.ObjectId;
  email: string;
  tokenType: TokenType;
}

type AccessTokenPayload = TokenPayload & { role: string };

class AuthService {
  static generateAccessToken(
    userId: string | Types.ObjectId,
    role: string,
    email: string
  ): string {
    const payload: AccessTokenPayload = {
      id: userId,
      role,
      email,
      tokenType: "access",
    };

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
    return token;
  }
  static verifyToken(token: string): AccessTokenPayload {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded as AccessTokenPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  static generateRefreshToken(
    userId: string | Types.ObjectId,
    email: string
  ): string {
    const payload: TokenPayload = { id: userId, email, tokenType: "refresh" };
    const secretKey = process.env.JWT_REFRESH_SECRET;
    if (!secretKey) {
      throw new Error(
        "JWT_REFRESH_SECRET is not defined in environment variables"
      );
    }

    const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });
    return token;
  }
  static verifyRefreshToken(token: string): TokenPayload | string {
    const secretKey = process.env.JWT_REFRESH_SECRET;

    if (!secretKey) {
      throw new Error(
        "JWT_REFRESH_SECRET is not defined in environment variables"
      );
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded as TokenPayload;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}
export default AuthService;
