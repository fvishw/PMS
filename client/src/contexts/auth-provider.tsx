import React, { createContext, useEffect, useState } from "react";

interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  designation: { title: string };
}

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (accessToken: string, user: IUser) => void;
  logout: () => void;
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
  const [user, setUser] = useState<IUser | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("accessToken"),
  );

  useEffect(() => {
    if (user) {
      console.log("AuthProvider - user changed:", user);
    }
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = (accessToken: string, userDetails: IUser) => {
    localStorage.setItem("accessToken", accessToken);
    setUser({
      ...userDetails,
    });
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    //here we need to call logout api to remove refresh toke from db
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };
  const authCtx = {
    user: user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authCtx}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, type AuthContextType };

export default AuthProvider;
