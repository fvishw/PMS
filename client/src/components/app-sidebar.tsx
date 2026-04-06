import * as React from "react";

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

import NexforgeLogo from "@/assets/nexforge.png";
import { useAuth } from "@/hooks/useAuthContext";
import { sidebarItems } from "./side-bar-items";

interface IUserConfig {
  name: string;
  email: string;
  avatar: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const role = user?.role || "employee";
  const items =
    sidebarItems[role as keyof typeof sidebarItems] ?? sidebarItems.employee;
  const userConfig: IUserConfig = user
    ? {
        name: user.fullName,
        email: user.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.fullName,
        )}&background=random&size=128`,
      }
    : {
        name: "",
        email: "",
        avatar:
          "https://ui-avatars.com/api/?name=Guest&background=random&size=128",
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
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white p-1 shadow-sm">
                  <img
                    src={NexforgeLogo}
                    alt="NexForge Logo"
                    className="!h-7 !w-7 object-contain"
                  />
                </span>
                <span className="text-base font-semibold mt-1.5">NexForge</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userConfig} />
      </SidebarFooter>
    </Sidebar>
  );
}
