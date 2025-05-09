"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { YoutubeIdea } from "@/lib/types";
import { IdeaCard } from "../../components/IdeaCard";

export default function YoutubeIdeasPage() {
  const {
    data: ideas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<YoutubeIdea[]>({
    queryKey: ["youtubeIdeas"],
    queryFn: async () => {
      const res = await fetch("/api/ideas/list");
      if (!res.ok) throw new Error("Failed to load saved ideas");
      return res.json();
    },
  });

  const groupedByChannel = ideas.reduce<Record<string, YoutubeIdea[]>>(
    (acc, idea) => {
      const channelTitle = idea.youtubeChannel?.title || "Unknown Channel";
      if (!acc[channelTitle]) acc[channelTitle] = [];
      acc[channelTitle].push(idea);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Your YouTube Ideas</h1>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="text-muted-foreground flex gap-2 items-center">
          <Spinner className="w-4 h-4" />
          Loading ideas...
        </div>
      )}

      {isError && (
        <p className="text-red-500 text-sm">Failed to load saved ideas.</p>
      )}

      {!isLoading && ideas.length === 0 && (
        <p className="text-muted-foreground text-sm">
          You haven't saved any ideas yet.
        </p>
      )}

      {Object.entries(groupedByChannel).map(([channelTitle, ideas]) => (
        <div key={channelTitle} className="mb-8">
          <h2 className="text-lg font-medium mb-3">{channelTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
