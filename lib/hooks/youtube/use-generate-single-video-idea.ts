import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { Idea, YoutubeVideoItem } from "@/lib/types";

interface Args {
  channelId: string;
  onSuccess: (ideas: Idea[]) => void;
}

interface MutationArgs {
  video: YoutubeVideoItem;
  youtubeChannelName: string | null;
}

export function useGenerateSingleVideoIdea({ channelId, onSuccess }: Args) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ video, youtubeChannelName }: MutationArgs) => {
      const res = await fetch("/api/ideas/generate/youtube/single-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          youtubeChannelName,
          video,
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
