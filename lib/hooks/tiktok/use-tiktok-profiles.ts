import { useQuery } from "@tanstack/react-query";
import { TikTokProfile } from "@/lib/types";

export function useTiktokProfiles() {
  return useQuery<TikTokProfile[]>({
    queryKey: ["tiktokProfiles"],
    queryFn: async () => {
      const res = await fetch("/api/tiktok/profiles");
      if (!res.ok) {
        throw new Error("Failed to fetch TikTok profiles");
      }
      return res.json();
    },
  });
}
