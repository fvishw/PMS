import { createBrowserRouter } from "react-router";
import { lazy } from "react";
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
        Component: lazy(() => import("@/pages/login")),
      },
      {
        path: "signup",
        Component: lazy(() => import("@/pages/signup")),
      },
      {
        path: "forgot-password",
        Component: lazy(() => import("@/pages/sentEmail")),
      },
      {
        path: "reset-password",
        Component: lazy(() => import("@/pages/resetPassword")),
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
        Component: lazy(() => import("@/pages/outlets/myAppraisalLayout")),
      },
      {
        path: "checkins",
        Component: lazy(() => import("@/pages/outlets/checkInLayout")),
      },
      {
        path: "me",
        Component: lazy(() => import("@/pages/outlets/profileLayout")),
      },
      {
        path: "kpis",
        Component: lazy(() => import("@/pages/outlets/kpiLayout")),
      },
      {
        path: "my-goals",
        Component: lazy(() => import("@/pages/outlets/myGoalsLayout")),
      },
      {
        path: "review-appraisals",
        children: [
          {
            index: true,
            Component: lazy(
              () => import("@/pages/outlets/reviewAppraisalLayout"),
            ),
          },
          {
            path: ":performanceId",
            Component: lazy(
              () => import("@/pages/outlets/reviewPerformanceLayout"),
            ),
          },
        ],
      },
      {
        path: "manage-goals",
        Component: lazy(() => import("@/pages/outlets/reviewGoalsLayout")),
      },
      {
        path: "manage-users",
        Component: lazy(() => import("@/pages/outlets/userManagementLayout")),
      },
      {
        path: "settings",
        Component: lazy(() => import("@/pages/outlets/settingsLayout")),
      },
      {
        path: "manage-performance",
        children: [
          {
            index: true,
            Component: lazy(
              () => import("@/pages/outlets/performanceManagementLayout"),
            ),
          },
          {
            path: ":performanceId",
            Component: lazy(() => import("@/pages/performanceTemplateDetails")),
          },
        ],
      },
      {
        path: "manage-checkins",
        Component: lazy(
          () => import("@/pages/outlets/checkInManagementLayout"),
        ),
      },
      {
        path: "reports",
        Component: lazy(() => import("@/pages/outlets/reportsLayout")),
      },
    ],
  },
]);

export default router;
