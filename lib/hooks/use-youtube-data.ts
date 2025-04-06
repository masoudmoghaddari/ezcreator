"use client";

import { useQuery } from "@tanstack/react-query";

interface VideoData {
  id: string;
  thumbnail: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
}

interface YouTubeResponse {
  videos: VideoData[];
}

export function useYoutubeData(channelUrl: string) {
  return useQuery<YouTubeResponse>({
    queryKey: ["youtubeData", channelUrl],
    queryFn: async () => {
      if (!channelUrl.trim()) {
        return { videos: [] };
      }

      const response = await fetch(
        `/api/youtube?channelUrl=${encodeURIComponent(channelUrl)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch YouTube data");
      }

      return response.json();
    },
    enabled: !!channelUrl.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
