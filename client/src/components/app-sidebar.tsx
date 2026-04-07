import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import NexforgeDarkLogo from "@/assets/nexforge-dark.png";
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
            <div className="w-full flex items-center justify-center">
              <img
                src={NexforgeLogo}
                alt="NexForge Logo"
                className="h-10 w-auto object-contain dark:hidden"
              />
              <img
                src={NexforgeDarkLogo}
                alt="NexForge Logo Dark"
                className="hidden h-10 w-auto object-contain dark:block"
              />
            </div>
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
