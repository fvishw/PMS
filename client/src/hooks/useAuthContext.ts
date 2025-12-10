import { AuthContext, AuthContextType } from "@/contexts/auth-provider";
import { useContext } from "react";

export const useAuthContext: () => AuthContextType = () => {
  const { login, logout, user } = useContext(AuthContext);

  return { login, logout, user };
};
