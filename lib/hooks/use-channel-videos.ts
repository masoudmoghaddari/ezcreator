import { useQuery } from "@tanstack/react-query";

export interface ChannelVideo {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: Date;
  duration: number;
  engagement_score: number;
}

export function useChannelVideos(channelId?: string) {
  return useQuery<ChannelVideo[]>({
    queryKey: ["channelVideos", channelId],
    queryFn: async () => {
      const res = await fetch(`/api/youtube/videos?channelId=${channelId}`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
    enabled: !!channelId,
  });
}
