import { useMutation } from "@tanstack/react-query";
import { InstagramProfile } from "@/lib/types";

async function addInstagramProfile(url: string): Promise<InstagramProfile> {
  const res = await fetch("/api/instagram/add-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error || "Add profile failed");
  }

  return res.json();
}

export function useAddInstagramProfile(
  onSuccess?: (profile: InstagramProfile) => void
) {
  return useMutation({
    mutationFn: addInstagramProfile,
    onSuccess,
  });
}
