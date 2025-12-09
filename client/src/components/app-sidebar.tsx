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

const sidebarItems = {
  userInfo: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  admin: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Personal Details",
      url: "#",
      icon: IconUser,
    },
    {
      title: "My Goals",
      url: "#",
      icon: IconTargetArrow,
    },
    {
      title: "Checkins",
      url: "#",
      icon: IconListCheck,
    },
    {
      title: "My Appraisal",
      url: "#",
      icon: IconTrophy,
    },
    {
      title: "Review Goals",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Review Appraisals",
      url: "#",
      icon: IconEyeEdit,
    },
  ],
  user: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Personal Details",
      url: "#",
      icon: IconUser,
    },
    {
      title: "KPIs",
      url: "#",
      icon: IconTargetArrow,
    },
    {
      title: "Checkins",
      url: "#",
      icon: IconListCheck,
    },
    {
      title: "My Appraisal",
      url: "#",
      icon: IconTrophy,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={sidebarItems.admin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarItems.userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
