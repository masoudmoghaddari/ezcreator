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
import { YouTube, Tiktok } from "./icons";
import { useUser } from "@clerk/nextjs";

const data = {
  navMain: [
    {
      title: "Youtube",
      url: "",
      icon: YouTube,
      isActive: true,
      items: [
        {
          title: "Channels",
          url: "/studio/youtube/channels",
        },
        {
          title: "Ideas",
          url: "/studio/youtube/ideas",
        },
      ],
    },
    {
      title: "Tiktok",
      url: "",
      icon: Tiktok,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/studio/tiktok/profile",
        },
        {
          title: "Ideas",
          url: "/studio/tiktok/ideas",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

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
        <NavUser
          user={{
            name: user?.firstName + " " + user?.lastName,
            email: user?.primaryEmailAddress?.emailAddress ?? "",
            avatar: user?.hasImage ? user.imageUrl : "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
