"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import AddChannelDialog from "./components/AddChannelDialog";
import { ChannelSelector } from "./components/ChannelSelector";
import ChannelOverview from "./components/ChannelOverview";
import GeneratedIdeas from "./components/GeneratedIdeas";
import { VideoTable } from "./components/VideoTable";
import { Button } from "@/components/ui/button";
import { useUserChannels } from "@/lib/hooks/youtube/use-user-channels";
import { useChannelVideos } from "@/lib/hooks/youtube/use-channel-videos";
import { Channel, Idea, SortBy, SortOrder } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { useSyncChannel } from "@/lib/hooks/youtube/use-sync-channel";
import { useGenerateIdeas } from "@/lib/hooks/youtube/use-generate-ideas";
import { sortYoutubeVideos } from "@/app/api/youtube/common/sortVideos";
import { YouTube } from "@/components/icons";

export default function YoutubeStudioPage() {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("engagement_score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const ideasSectionRef = useRef<HTMLDivElement | null>(null);

  const { mutate: generateIdeas, isPending: isGenerating } = useGenerateIdeas({
    channelId: selectedChannelId ?? null,
    onSuccess: (ideas) => {
      setIdeas(ideas);
    },
  });

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
    if (ideas.length > 0 && ideasSectionRef.current) {
      ideasSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ideas]);

  useEffect(() => {
    if (!selectedChannelId && channels.length > 0) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, selectedChannelId]);

  const sortedVideos = sortYoutubeVideos(videos, sortBy, sortOrder);

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
            <YouTube className="w-10 h-10 text-primary mb-2" />
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
            <YouTube className="w-10 h-10 text-primary mb-2" />
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
            <Button
              size="lg"
              disabled={!selectedChannel || isGenerating}
              onClick={() =>
                generateIdeas(
                  sortYoutubeVideos(videos, "engagement_score", "desc")
                )
              }
            >
              {isGenerating ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate my next content idea
            </Button>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-3">
              We'll generate content ideas from top-performing videos of the
              selected channel.
            </p>
          </div>
          <div ref={ideasSectionRef}>
            {selectedChannelId && ideas.length > 0 && (
              <GeneratedIdeas ideas={ideas} sourceId={selectedChannelId} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
