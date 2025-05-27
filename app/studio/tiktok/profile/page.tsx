"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTiktokVideos } from "@/lib/hooks/tiktok/use-tiktok-videos";
import { useSyncTiktokProfile } from "@/lib/hooks/tiktok/use-sync-tiktok-profile";
import { InstagramProfile, Idea, SortBy, SortOrder } from "@/lib/types";
import { Tiktok } from "@/components/icons";
import { useGenerateIdeas } from "@/lib/hooks/common/use-generate-ideas";
import GeneratedIdeas from "../../youtube/channels/components/GeneratedIdeas";
import { useTiktokProfiles } from "@/lib/hooks/tiktok/use-tiktok-profiles";
import { sortTiktokVideos } from "@/lib/utils/sortVideos";
import AddTiktokProfileDialog from "./components/AddTiktokProfileDialog";
import { ProfileSelector } from "./components/ProfileSelector";
import { ProfileOverview } from "./components/ProfileOverview";
import { VideoTable } from "./components/VideoTable";

export default function TikTokStudioPage() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("engagement_score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const ideasSectionRef = useRef<HTMLDivElement | null>(null);

  const { mutate: generateIdeas, isPending: isGenerating } = useGenerateIdeas({
    profileId: selectedProfileId ?? null,
    onSuccess: (ideas) => {
      setIdeas(ideas);
    },
  });

  const {
    data: profiles = [],
    isLoading: profilesIsLoading,
    isError: profilesIsError,
    refetch: refetchProfiles,
  } = useTiktokProfiles();

  const selectedProfile =
    profiles.find((p) => p.id === selectedProfileId) || null;

  const {
    data: videos = [],
    isLoading: videosIsLoading,
    isError: videosIsError,
  } = useTiktokVideos(selectedProfile?.id);

  const { mutateAsync: resyncProfile, isPending: resyncIsPending } =
    useSyncTiktokProfile();

  useEffect(() => {
    if (ideas.length > 0 && ideasSectionRef.current) {
      ideasSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ideas]);

  useEffect(() => {
    if (!selectedProfileId && profiles.length > 0) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  const sortedVideos = sortTiktokVideos(videos, sortBy, sortOrder);

  const handleAddProfile = (profile: InstagramProfile) => {
    setSelectedProfileId(profile.id);
    refetchProfiles();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <AddTiktokProfileDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddProfile={handleAddProfile}
      />

      {profilesIsLoading && (
        <div className="border rounded-md p-10 text-center text-muted-foreground space-y-4 bg-muted/50">
          <div className="flex justify-center">
            <Tiktok className="w-10 h-10 text-primary mb-2" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Loading TikTok profiles...
          </h2>
          <p className="max-w-md mx-auto">
            Hang tight while we fetch your TikTok profiles!
          </p>
          <Spinner />
        </div>
      )}

      {!profilesIsLoading && profiles.length === 0 && (
        <div className="border rounded-md p-10 text-center text-muted-foreground space-y-4 bg-muted/50">
          <div className="flex justify-center">
            <Tiktok className="w-10 h-10 text-primary mb-2" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            No TikTok profiles added yet
          </h2>
          <p className="max-w-md mx-auto">
            Add a TikTok profile to start generating AI-powered content ideas
            based on your videos.
          </p>
          <Button size="lg" onClick={() => setShowAddDialog(true)}>
            <Sparkles className="w-4 h-4 mr-2" /> Add Your First Profile
          </Button>
        </div>
      )}

      {!profilesIsLoading && profiles.length > 0 && (
        <>
          <ProfileSelector
            profiles={profiles}
            isLoading={profilesIsLoading}
            isError={profilesIsError}
            selectedProfileId={selectedProfileId}
            onSelectProfile={(id) => setSelectedProfileId(id)}
            onAddNew={() => setShowAddDialog(true)}
          />

          {selectedProfile ? (
            <ProfileOverview
              selectedProfile={selectedProfile}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
              resyncFunction={resyncProfile}
              resyncIsPending={resyncIsPending}
            >
              <VideoTable
                videos={sortedVideos}
                isLoading={videosIsLoading}
                isError={videosIsError}
              />
            </ProfileOverview>
          ) : (
            <div className="text-sm text-muted-foreground py-6">
              Select a profile to view its videos.
            </div>
          )}

          <div className="text-center py-14">
            <Button
              size="lg"
              disabled={!selectedProfile || isGenerating}
              onClick={() =>
                generateIdeas(
                  sortTiktokVideos(videos, "engagement_score", "desc")
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
              selected TikTok profile.
            </p>
          </div>

          <div ref={ideasSectionRef}>
            {selectedProfileId && ideas.length > 0 && (
              <GeneratedIdeas ideas={ideas} sourceId={selectedProfileId} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
