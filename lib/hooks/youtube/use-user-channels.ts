import { Channel, UserChannel } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useUserChannels() {
  return useQuery<Channel[]>({
    queryKey: ["userChannels"],
    queryFn: async () => {
      const res = await fetch("/api/youtube/channel/my-channels");
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
