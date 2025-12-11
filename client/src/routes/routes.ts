import { createBrowserRouter } from "react-router";
import DashboardPage from "@/pages/dashboard";
import SignupPage from "@/pages/signup";
import LoginPage from "@/pages/login";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicRoute,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: "signup",
        Component: SignupPage,
      },
    ],
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        path: "dashboard",
        Component: DashboardPage,
      },
    ],
  },
]);

export default router;
