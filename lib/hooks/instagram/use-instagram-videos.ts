import { InstagramProfileVideo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useInstagramVideos(profileId?: string | null) {
  return useQuery<InstagramProfileVideo[]>({
    queryKey: ["instagramVideos", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const res = await fetch(`/api/instagram/videos?profileId=${profileId}`);
      if (!res.ok) {
        throw new Error("Failed to load Instagram videos");
      }
      return res.json();
    },
  });
}
