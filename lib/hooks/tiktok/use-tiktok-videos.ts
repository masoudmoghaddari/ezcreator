import { useQuery } from "@tanstack/react-query";
import { TikTokProfileVideo } from "@/lib/types";

export function useTiktokVideos(profileId?: string | null) {
  return useQuery<TikTokProfileVideo[]>({
    queryKey: ["tiktokVideos", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const res = await fetch(`/api/tiktok/videos?profileId=${profileId}`);
      if (!res.ok) throw new Error("Failed to load TikTok videos");
      return res.json();
    },
  });
}
