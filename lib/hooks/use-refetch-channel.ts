import { useMutation } from "@tanstack/react-query";

export function useRefetchChannel() {
  return useMutation({
    mutationFn: async (videoId: string) => {
      const res = await fetch("/api/youtube/refetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Refetch failed");
      }

      return res.json();
    },
  });
}
