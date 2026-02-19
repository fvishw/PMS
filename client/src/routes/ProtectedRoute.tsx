import isTokenExpired from "@/utils/checkToken";
import { Navigate } from "react-router";

const ProtectedRoute: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const token = localStorage.getItem("accessToken");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
