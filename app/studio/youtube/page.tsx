"use client";

import { useEffect, useState } from "react";
import { Sparkles, Youtube } from "lucide-react";
import AddChannelDialog from "./components/AddChannelDialog";
import { ChannelSelector } from "./components/ChannelSelector";
import ChannelOverview from "./components/ChannelOverview";
import GeneratedIdeas from "./components/GeneratedIdeas";
import { VideoTable } from "./components/VideoTable";
import { Button } from "@/components/ui/button";
import { useUserChannels } from "@/lib/hooks/use-user-channels";
import { useChannelVideos } from "@/lib/hooks/use-channel-videos";
import { SortBy, SortOrder } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

export default function YoutubeStudioPage() {
  const [selectedChannel, setSelectedChannel] = useState<{
    id: string;
    title: string;
    syncedAt: Date;
  } | null>(null);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("views");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const {
    data: channels = [],
    isLoading: channelsIsLoading,
    isError: channelsIsError,
    refetch: refetchChannels,
  } = useUserChannels();

  const {
    data: videos = [],
    isLoading: videosIsLoading,
    isError: videosIsError,
  } = useChannelVideos(selectedChannel?.id);

  // Auto-select the first channel
  useEffect(() => {
    if (!selectedChannel && channels.length > 0) {
      setSelectedChannel(channels[0]);
    }
  }, [channels, selectedChannel]);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    const keyMap = {
      views: "view_count",
      likes: "like_count",
      comments: "comment_count",
    } as const;

    const key = keyMap[sortBy as keyof typeof keyMap];

    if (key) {
      return sortOrder === "asc"
        ? (a[key] ?? 0) - (b[key] ?? 0)
        : (b[key] ?? 0) - (a[key] ?? 0);
    }

    return 0;
  });

  const handleAddChannel = (channel: {
    id: string;
    title: string;
    syncedAt: Date;
  }) => {
    setSelectedChannel(channel);
    refetchChannels();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <AddChannelDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddChannel={handleAddChannel}
      />

      {channelsIsLoading && (
        <div className="border rounded-md p-10 text-center text-muted-foreground space-y-4 bg-muted/50">
          <div className="flex justify-center">
            <Youtube className="w-10 h-10 text-primary mb-2" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Loading channels...
          </h2>
          <p className="max-w-md mx-auto">
            Hang tight while we fetch your YouTube channels!
          </p>
          <Spinner />
        </div>
      )}

      {!channelsIsLoading && channels.length === 0 && (
        <div className="border rounded-md p-10 text-center text-muted-foreground space-y-4 bg-muted/50">
          <div className="flex justify-center">
            <Youtube className="w-10 h-10 text-primary mb-2" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            No channels added yet
          </h2>
          <p className="max-w-md mx-auto">
            Add a YouTube channel to start generating AI-powered content ideas
            based videos.
          </p>
          <Button size="lg" onClick={() => setShowAddDialog(true)}>
            <Sparkles className="w-4 h-4 mr-2" /> Add Your First Channel
          </Button>
        </div>
      )}

      {!channelsIsLoading && channels.length > 0 && (
        <>
          <ChannelSelector
            channels={channels}
            isLoading={channelsIsLoading}
            isError={channelsIsError}
            selectedChannelId={selectedChannel?.id || null}
            onSelectChannel={setSelectedChannel}
            onAddNew={() => setShowAddDialog(true)}
          />
          {selectedChannel ? (
            <ChannelOverview
              selectedChannel={selectedChannel}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
            >
              <VideoTable
                videos={sortedVideos}
                isLoading={videosIsLoading}
                isError={videosIsError}
              />
            </ChannelOverview>
          ) : (
            <div className="text-sm text-muted-foreground py-6">
              Select a channel to view its videos.
            </div>
          )}

          <div className="text-center py-14">
            <Button size="lg" disabled={!selectedChannel}>
              <Sparkles className="w-4 h-4 mr-2" /> Generate ideas from Top
              Picks
            </Button>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-3">
              We'll generate content ideas from top-performing videos of the
              selected channel.
            </p>
          </div>

          <GeneratedIdeas />
        </>
      )}
    </div>
  );
}
