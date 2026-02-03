import {
  type Icon,
  IconDashboard,
  IconDatabaseCog,
  IconEyeEdit,
  IconListCheck,
  IconListDetails,
  IconTargetArrow,
  IconTrophy,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
type role = "admin" | "manager" | "employee";

type SidebarItem = {
  title: string;
  url: string;
  icon: Icon;
};

export const sidebarItems: Record<role, SidebarItem[]> = {
  admin: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "User Management",
      url: "manage-users",
      icon: IconUsers,
    },
    {
      title: "CheckIn Management",
      url: "manage-checkins",
      icon: IconListCheck,
    },
    {
      title: "Performance Management",
      url: "manage-performance",
      icon: IconDatabaseCog,
    },
    {
      title: "Review Goals",
      url: "manage-goals",
      icon: IconListDetails,
    },
    {
      title: "Review Appraisals",
      url: "review-appraisals",
      icon: IconEyeEdit,
    },
    {
      title: "Personal Details",
      url: "me",
      icon: IconUser,
    },
    {
      title: "Settings",
      url: "settings",
      icon: IconDatabaseCog,
    },
  ],
  manager: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Personal Details",
      url: "me",
      icon: IconUser,
    },
    {
      title: "KPIs",
      url: "kpis",
      icon: IconTargetArrow,
    },
    {
      title: "Checkins",
      url: "checkins",
      icon: IconListCheck,
    },
    {
      title: "My Appraisal",
      url: "my-appraisal",
      icon: IconTrophy,
    },
    {
      title: "Review Appraisals",
      url: "review-appraisals",
      icon: IconEyeEdit,
    },
    {
      title: "My Goals",
      url: "my-goals",
      icon: IconListDetails,
    },
  ],
  employee: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Personal Details",
      url: "me",
      icon: IconUser,
    },
    {
      title: "KPIs",
      url: "kpis",
      icon: IconTargetArrow,
    },
    {
      title: "Checkins",
      url: "checkins",
      icon: IconListCheck,
    },
    {
      title: "My Appraisal",
      url: "my-appraisal",
      icon: IconTrophy,
    },
    {
      title: "My Goals",
      url: "my-goals",
      icon: IconListDetails,
    },
    {
      title: "Reports",
      url: "reports",
      icon: IconDatabaseCog,
    },
  ],
};
