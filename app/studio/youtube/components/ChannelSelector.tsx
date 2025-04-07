// components/ChannelSelector.tsx

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Plus } from "lucide-react";

interface Channel {
  id: string;
  title: string;
}

interface Props {
  channels: Channel[];
  selectedChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  onOpenAddDialog: () => void;
}

export default function ChannelSelector({
  channels,
  selectedChannel,
  onSelectChannel,
  onOpenAddDialog,
}: Props) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>Select a YouTube Channel</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Choose a channel below, or add a new one to analyze.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant={channel.id === selectedChannel.id ? "default" : "outline"}
            onClick={() => onSelectChannel(channel)}
          >
            <Youtube className="w-4 h-4 mr-1" />
            {channel.title}
          </Button>
        ))}
        <Button variant="ghost" onClick={onOpenAddDialog}>
          <Plus className="w-4 h-4 mr-1" /> Add New Channel
        </Button>
      </CardContent>
    </Card>
  );
}
