import {
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

export const sidebarItems: Record<
  role,
  Array<{ title: string; url: string; icon: React.ElementType }>
> = {
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
  ],
};
