"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Instagram } from "@/components/icons";
import AddInstagramProfileDialog from "./components/AddInstagramProfileDialog";
import { ProfileSelector } from "./components/ProfileSelector";
import { ProfileOverview } from "./components/ProfileOverview";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useFetchInstagramProfiles } from "@/lib/hooks/instagram/use-fetch-instagram-profile";
import { useInstagramVideos } from "@/lib/hooks/instagram/use-instagram-videos";
import { useSyncInstagramProfile } from "@/lib/hooks/instagram/use-sync-instagram-profile";
import { useGenerateIdeas } from "@/lib/hooks/common/use-generate-ideas";
import { sortInstagramVideos } from "@/app/api/youtube/common/sortVideos";
import { InstagramProfile, Idea, SortBy, SortOrder } from "@/lib/types";
import { VideoTable } from "./components/VideoTable";
import GeneratedIdeas from "../../youtube/channels/components/GeneratedIdeas";

export default function InstagramStudioPage() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("engagement_score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const ideasSectionRef = useRef<HTMLDivElement | null>(null);

  const { mutate: generateIdeas, isPending: isGenerating } = useGenerateIdeas({
    profileId: selectedProfileId,
    onSuccess: setIdeas,
  });

  const {
    data: profiles = [],
    isLoading: profilesLoading,
    isError: profilesError,
    refetch: refetchProfiles,
  } = useFetchInstagramProfiles();

  const selectedProfile =
    profiles.find((p) => p.id === selectedProfileId) || null;

  const {
    data: videos = [],
    isLoading: videosLoading,
    isError: videosError,
  } = useInstagramVideos(selectedProfileId);

  const { mutateAsync: resyncProfile, isPending: resyncIsPending } =
    useSyncInstagramProfile();

  // useEffect(() => {
  //   if (ideas.length > 0 && ideasSectionRef.current) {
  //     ideasSectionRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [ideas]);

  useEffect(() => {
    if (!selectedProfileId && profiles.length > 0) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  const sortedVideos = sortInstagramVideos(videos, sortBy, sortOrder);

  const handleAddProfile = (profile: InstagramProfile) => {
    setSelectedProfileId(profile.id);
    alert("test");
    // refetchProfiles();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <AddInstagramProfileDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddProfile={handleAddProfile}
      />

      {profilesLoading && (
        <div className="border rounded-md p-10 text-center text-muted-foreground space-y-4 bg-muted/50">
          <div className="flex justify-center">
            <Instagram className="w-10 h-10 text-primary mb-2 fill-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Loading Instagram profiles...
          </h2>
          <p className="max-w-md mx-auto">
            Hang tight while we fetch the Instagram profiles!
          </p>
          <Spinner />
        </div>
      )}

      {!profilesLoading && profiles.length === 0 && (
        <div className="border rounded-md p-10 text-center text-muted-foreground space-y-4 bg-muted/50">
          <div className="flex justify-center">
            <Instagram className="w-10 h-10 text-primary mb-2" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            No profiles connected yet
          </h2>
          <p className="max-w-md mx-auto">
            Connect your Instagram profile to start generating AI-powered
            content ideas based on your posts and reels.
          </p>
          <Button size="lg" onClick={() => setShowAddDialog(true)}>
            <Sparkles className="w-4 h-4 mr-2" /> Connect Instagram Profile
          </Button>
        </div>
      )}

      {!profilesLoading && profiles.length > 0 && (
        <>
          <ProfileSelector
            profiles={profiles}
            isLoading={profilesLoading}
            isError={profilesError}
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
                isLoading={videosLoading}
                isError={videosError}
              />
            </ProfileOverview>
          ) : (
            <div className="text-sm text-muted-foreground py-6">
              Select a profile to view its posts.
            </div>
          )}

          <div className="text-center py-14">
            <Button
              size="lg"
              disabled={!selectedProfile || isGenerating}
              onClick={() =>
                generateIdeas(
                  sortInstagramVideos(videos, "engagement_score", "desc")
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
              We'll generate content ideas from top-performing Instagram posts
              and reels.
            </p>
          </div>

          <div ref={ideasSectionRef}>
            {selectedProfileId && ideas.length > 0 && (
              <GeneratedIdeas
                ideas={ideas}
                instagramProfileId={selectedProfileId}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
