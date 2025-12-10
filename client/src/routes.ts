import { createBrowserRouter } from "react-router";
import DashboardPage from "./pages/dashboard";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/",
    Component: LoginPage,
  },
]);

export default router;
