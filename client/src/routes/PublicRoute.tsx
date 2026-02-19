import isTokenExpired from "@/utils/checkToken";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  const isExpired = token ? isTokenExpired(token) : false;
  const hasValidToken = !!token && !isExpired;

  if (hasValidToken) {
    return <Navigate to="/dashboard" replace />;
  }

  if (token && isExpired) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  return <Outlet />;
};

export default PublicRoute;
