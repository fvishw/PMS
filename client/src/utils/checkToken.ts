import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime + 30;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export default isTokenExpired;
