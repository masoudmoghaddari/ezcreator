import { useQuery } from "@tanstack/react-query";

export interface UserChannel {
  id: string;
  title: string;
  avatar_url: string;
  synced_at: string;
}

export function useUserChannels() {
  return useQuery<UserChannel[]>({
    queryKey: ["userChannels"],
    queryFn: async () => {
      const res = await fetch("/api/youtube/my-channels");
      if (!res.ok) throw new Error("Failed to load channels");
      return res.json();
    },
  });
}
