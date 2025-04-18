import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { VideoItem } from "@/app/studio/youtube/channels/components/VideoTable";
import { Idea } from "../types";

interface Args {
  channelId: string | null;
  onSuccess: (ideas: Idea[]) => void;
}

export function useGenerateIdeas({ channelId, onSuccess }: Args) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (videos: VideoItem[]) => {
      const res = await fetch("/api/youtube/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          videos: videos.slice(
            0,
            parseInt(
              process.env.NUMBER_OF_TOP_VIDEOS_TO_SELECT_FOR_IDEA_GENERATION ||
                "5"
            )
          ), // Top 5 videos
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate ideas");
      }

      return res.json();
    },
    onSuccess: (data) => {
      onSuccess(parseIdeasResponse(data.ideas));
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}

function parseIdeasResponse(response: string): Idea[] {
  try {
    // Strip code block markers like ```json and ```
    const cleaned = response
      .trim()
      .replace(/^```json\n?|```$/g, "")
      .replace(/```$/, "");
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse ideas response:", err);
    return [];
  }
}
