"use client";

import { useMutation } from "@tanstack/react-query";
import { TikTokProfile } from "@/lib/types";
import { useToast } from "@/components/hooks/use-toast";

async function addTikTokProfile(url: string): Promise<TikTokProfile> {
  const res = await fetch("/api/tiktok/add-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error || "Failed to add TikTok profile.");
  }

  return res.json();
}

export function useAddTikTokProfile(
  onSuccessCallback: (profile: TikTokProfile) => void
) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: addTikTokProfile,
    onSuccess: (data) => {
      onSuccessCallback(data);
      toast({
        title: "Profile added",
        description: `${data.nickname} was added successfully.`,
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error adding profile",
        description: error.message,
      });
    },
  });
}
