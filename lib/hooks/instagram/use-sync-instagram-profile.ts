// lib/hooks/use-sync-instagram-profile.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSyncInstagramProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const res = await fetch("/api/instagram/sync-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to sync profile");
      }

      return res.json();
    },
    onSuccess: (_, profileId) => {
      queryClient.invalidateQueries({ queryKey: ["instagramProfiles"] });
      queryClient.invalidateQueries({
        queryKey: ["instagramVideos", profileId],
      });
    },
  });
}
