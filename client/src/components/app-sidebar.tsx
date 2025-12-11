import * as React from "react";
import {
  IconDashboard,
  IconEyeEdit,
  IconListCheck,
  IconListDetails,
  IconTargetArrow,
  IconTrophy,
  IconUser,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import NFLogo from "../assets/nf-logo.svg";
import { useAuth } from "@/hooks/useAuthContext";

interface IUserConfig {
  name: string;
  email: string;
  avatar: string;
}

const sidebarItems = {
  admin: [
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
      title: "My Goals",
      url: "my-goals",
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
      title: "Review Goals",
      url: "review-goals",
      icon: IconListDetails,
    },
    {
      title: "Review Appraisals",
      url: "review-appraisals",
      icon: IconEyeEdit,
    },
  ],
  user: [
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const isAdmin = user?.role.toLowerCase() === "admin";

  const userConfig: IUserConfig = user
    ? {
        name: user.fullName,
        email: user.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.fullName
        )}&background=random&size=128`,
      }
    : {
        name: "",
        email: "",
        avatar: "",
      };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img
                  src={NFLogo}
                  alt="NexForge Logo"
                  className="!h-8 !w-8 object-contain"
                />

                <span className="text-base font-semibold mt-1.5">NexForge</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={isAdmin ? sidebarItems.admin : sidebarItems.user} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userConfig} />
      </SidebarFooter>
    </Sidebar>
  );
}
