// components/ChannelSelector.tsx

import { YouTube } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { YoutubeChannel } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface ChannelSelectorProps {
  channels: YoutubeChannel[];
  isLoading: boolean;
  isError: boolean;
  selectedChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
  onAddNew: () => void;
}

export function ChannelSelector({
  channels,
  isLoading,
  isError,
  selectedChannelId,
  onSelectChannel,
  onAddNew,
}: ChannelSelectorProps) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>Select a YouTube Channel</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Choose a channel below, or add a new one to analyze.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading channels...
          </div>
        )}
        {isError && (
          <p className="text-sm text-red-500">Failed to load channels</p>
        )}
        {!isLoading && !isError && channels.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You haven’t added any channels yet.
          </p>
        )}
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant={channel.id === selectedChannelId ? "default" : "outline"}
            onClick={() => onSelectChannel(channel.id)}
          >
            <YouTube className="w-4 h-4 mr-1" />
            {channel.title}
          </Button>
        ))}
        <Button variant="ghost" onClick={onAddNew}>
          ➕ Add New Channel
        </Button>
      </CardContent>
    </Card>
  );
}
