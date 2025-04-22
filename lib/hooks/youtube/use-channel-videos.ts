import { YoutubeVideoItem } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useChannelVideos(channelId?: string) {
  return useQuery<YoutubeVideoItem[]>({
    queryKey: ["channelVideos", channelId],
    queryFn: async () => {
      const res = await fetch(
        `/api/youtube/channel/videos?channelId=${channelId}`
      );
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
    enabled: !!channelId,
  });
}
