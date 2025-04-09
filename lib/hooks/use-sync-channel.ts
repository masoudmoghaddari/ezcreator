import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export function useSyncChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelDbId: string) => {
      const res = await fetch("/api/youtube/refetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelDbId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Refetch failed");
      }

      return res.json();
    },
    onSuccess: (_data, channelDbId) => {
      // Invalidate query caches so they refetch fresh data
      // updates last synced
      queryClient.invalidateQueries({ queryKey: ["userChannels"] });
      // updates videos
      queryClient.invalidateQueries({
        queryKey: ["channelVideos", channelDbId],
      });
    },
    onError: (err) => {
      console.error("Error syncing channel", err.message);
    },
  });
}
