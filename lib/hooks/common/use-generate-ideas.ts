// lib/hooks/use-generate-ideas.ts

import { useMutation } from "@tanstack/react-query";
import { Idea } from "@/lib/types";

interface UseGenerateIdeasProps {
  profileId: string | null;
  onSuccess: (ideas: Idea[]) => void;
}

export function useGenerateIdeas({
  profileId,
  onSuccess,
}: UseGenerateIdeasProps) {
  return useMutation({
    mutationFn: async (videos: any[]): Promise<Idea[]> => {
      if (!profileId) throw new Error("Missing profile ID");

      const res = await fetch("/api/ideas/generate/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videos, profileId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to generate ideas");
      }

      return res.json();
    },
    onSuccess,
  });
}
