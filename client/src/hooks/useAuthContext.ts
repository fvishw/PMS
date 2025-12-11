import { AuthContext, AuthContextType } from "@/contexts/auth-provider";
import { useContext } from "react";

export const useAuth = (): AuthContextType => {
  const { login, logout, user, isAuthenticated } = useContext(AuthContext);

  return { login, logout, user, isAuthenticated };
};
