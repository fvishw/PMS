import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import SignupPage from "@/pages/signup";
import LoginPage from "@/pages/login";
import PublicRoute from "./PublicRoute";
import ProtectedDashboard from "./protectedDashboard";
import HomeOutlet from "@/pages/outlets/homeOutlet";

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
    Component: ProtectedDashboard,
    children: [
      {
        path: "dashboard",
        Component: HomeOutlet,
      },
      {
        path: "profile",
        Component: lazy(() => import("@/pages/outlets/profileLayout")),
      },
      {
        path: "my-appraisal",
        Component: lazy(() => import("@/pages/outlets/myApperaisalLayout")),
      },
      {
        path: "checkins",
        Component: lazy(() => import("@/pages/outlets/chekinLayout")),
      },
      {
        path: "me",
        Component: lazy(() => import("@/pages/outlets/profileLayout")),
      },
      {
        path: "kpis",
        Component: lazy(() => import("@/pages/outlets/kpisLayout")),
      },
      {
        path: "my-goals",
        Component: lazy(() => import("@/pages/outlets/myGoalLayout")),
      },
      {
        path: "review-appraisals",
        Component: lazy(() => import("@/pages/outlets/reviewAppraisalLayout")),
      },
      {
        path: "review-goals",
        Component: lazy(() => import("@/pages/outlets/reviewGoalsLayout")),
      },
    ],
  },
]);

export default router;
