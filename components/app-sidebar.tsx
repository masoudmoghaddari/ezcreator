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
