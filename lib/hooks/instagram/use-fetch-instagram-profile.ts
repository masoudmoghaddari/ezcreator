// lib/hooks/use-instagram-profiles.ts

import { useQuery } from "@tanstack/react-query";

export interface InstagramProfile {
  id: string;
  username: string;
  avatar_url?: string;
  synced_at: string;
  title?: string; // optional display title, e.g. name
}

export function useFetchInstagramProfiles() {
  return useQuery<InstagramProfile[]>({
    queryKey: ["instagramProfiles"],
    queryFn: async () => {
      const res = await fetch("/api/instagram/my-profiles");
      if (!res.ok) {
        throw new Error("Failed to load Instagram profiles");
      }
      return res.json();
    },
  });
}
