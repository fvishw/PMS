import jwt from "jsonwebtoken";
class AuthService {
  static generateToken(userId: string, role: string, email: string): string {
    const payload = { userId, role, email };
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
    return token;
  }
  static verifyToken(token: string): any {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
export default AuthService;
