import { Navigate } from "react-router";

const ProtectedRoute: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
