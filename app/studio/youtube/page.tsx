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
import { Channel, SortBy, SortOrder } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { useSyncChannel } from "@/lib/hooks/use-sync-channel";

export default function YoutubeStudioPage() {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("engagement_score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const {
    data: channels = [],
    isLoading: channelsIsLoading,
    isError: channelsIsError,
    refetch: refetchChannels,
  } = useUserChannels();

  const selectedChannel =
    channels.find((c) => c.id === selectedChannelId) || null;

  const {
    data: videos = [],
    isLoading: videosIsLoading,
    isError: videosIsError,
  } = useChannelVideos(selectedChannel?.id);

  const { mutateAsync: resyncChannel, isPending: resyncIsPending } =
    useSyncChannel();

  useEffect(() => {
    if (!selectedChannelId && channels.length > 0) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, selectedChannelId]);

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
      duration: "duration",
      published_at: "published_at",
      engagement_score: "engagement_score",
    } as const;

    const key = keyMap[sortBy as keyof typeof keyMap];

    if (key) {
      const aVal = a[key] ?? 0;
      const bVal = b[key] ?? 0;

      if (key === "published_at") {
        return sortOrder === "asc"
          ? new Date(aVal).getTime() - new Date(bVal).getTime()
          : new Date(bVal).getTime() - new Date(aVal).getTime();
      }

      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    }

    return 0;
  });

  const handleAddChannel = (channel: Channel) => {
    setSelectedChannelId(channel.id);
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
            based on your videos.
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
            selectedChannelId={selectedChannelId}
            onSelectChannel={(id) => setSelectedChannelId(id)}
            onAddNew={() => setShowAddDialog(true)}
          />

          {selectedChannel ? (
            <ChannelOverview
              selectedChannel={selectedChannel}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
              resyncFunction={resyncChannel}
              resyncIsPending={resyncIsPending}
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
