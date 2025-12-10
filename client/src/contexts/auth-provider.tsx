import React, { createContext, useState } from "react";

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (user: IUser) => void;
  logout: () => void;
}

interface IAuthDetails {
  user: IUser | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IAuthDetails>({
    user: null,
    isAuthenticated: false,
  });

  const login = (userDetails: IUser) => {
    setUser({
      user: userDetails,
      isAuthenticated: true,
    });
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    //here we need to call logout api to remove refresh toke from db
  };
  const authCtx = {
    user: user.user,
    isAuthenticated: user.isAuthenticated,
    login,
    logout,
  };

  <AuthContext.Provider value={authCtx}>{children}</AuthContext.Provider>;
};

export { AuthContext, type AuthContextType };

export default AuthProvider;
