"use client";

import { IdeaCard } from "@/app/studio/components/IdeaCard";
import { useSaveIdea } from "@/lib/hooks/common/use-save-idea";
import { Idea } from "@/lib/types";

interface GeneratedIdeasProps {
  ideas: Idea[];
  youtubeChannelId: string;
}

export default function GeneratedIdeas({
  ideas,
  youtubeChannelId,
}: GeneratedIdeasProps) {
  if (!ideas || ideas.length === 0) return null;
  const { mutateAsync, isPending } = useSaveIdea();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Generated Ideas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea, i) => (
          <IdeaCard
            key={i}
            idea={idea}
            index={i}
            onSave={async (idea) =>
              await mutateAsync({
                title: idea.title,
                description: idea.description,
                youtube_channel_id: youtubeChannelId,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
