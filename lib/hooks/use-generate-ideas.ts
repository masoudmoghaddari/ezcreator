import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { VideoItem } from "@/app/studio/youtube/components/VideoTable";
import { Idea } from "../types";

export function useGenerateIdeas(
  channelId: string | null,
  onSuccess: (ideas: Idea[]) => void
) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (videos: VideoItem[]) => {
      const res = await fetch("/api/youtube/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          videos: videos.slice(0, 5), // Top 5 videos
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
