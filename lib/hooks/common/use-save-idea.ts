import { useMutation } from "@tanstack/react-query";

export function useSaveIdea() {
  return useMutation({
    mutationFn: async (idea: {
      title: string;
      description: string;
      youtube_channel_id?: string;
      instagram_profile_id?: string;
    }) => {
      const res = await fetch("/api/ideas/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idea),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to save idea");
      }

      return res.json();
    },
  });
}
