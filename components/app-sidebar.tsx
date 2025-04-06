"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppLogo } from "./app-logo";
import YouTube from "./icons/youtube";
import { Lightbulb } from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar:
      "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3b63b32c40b142bd5a69bb170826d5c8cbf3a041.jpg",
  },
  navMain: [
    {
      title: "Youtube",
      url: "",
      icon: YouTube,
      isActive: true,
      items: [
        {
          title: "Channels",
          url: "/studio/youtube",
        },
        {
          title: "Generate ideas",
          url: "#",
        },
      ],
    },
    {
      title: "My ideas",
      url: "",
      icon: Lightbulb,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
