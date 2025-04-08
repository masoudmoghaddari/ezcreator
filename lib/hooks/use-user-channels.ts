import { useQuery } from "@tanstack/react-query";
import { Channel } from "../types";

export interface UserChannel {
  id: string;
  title: string;
  avatar_url: string;
  synced_at: string;
}

export function useUserChannels() {
  return useQuery<Channel[]>({
    queryKey: ["userChannels"],
    queryFn: async () => {
      const res = await fetch("/api/youtube/my-channels");
      if (!res.ok) throw new Error("Failed to load channels");
      const data = (await res.json()) as UserChannel[];
      return data.map((channel) => ({
        id: channel.id,
        title: channel.title,
        avatarUrl: channel.avatar_url,
        syncedAt: new Date(channel.synced_at),
      }));
    },
  });
}
