import { useMutation } from "@tanstack/react-query";

export function useSyncTiktokProfile() {
  return useMutation({
    mutationFn: async (profileId: string) => {
      const res = await fetch("/api/tiktok/sync-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      if (!res.ok) throw new Error("Failed to sync TikTok profile");
      return res.json();
    },
  });
}
