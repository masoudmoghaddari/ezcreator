"use client";

import { Tiktok } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function TikTokConnectSection() {
  const handleConnect = () => {
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!;
    alert(clientKey);
    const redirectUri = encodeURIComponent(
      "http://localhost:3000/api/tiktok/callback"
    );
    const state = crypto.randomUUID();

    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=user.info.basic,video.list&redirect_uri=${redirectUri}&state=${state}`;

    window.location.href = tiktokAuthUrl;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <div className="border rounded-md p-10 text-center text-muted-foreground space-y-4 bg-muted/50">
        <div className="flex justify-center">
          <Tiktok className="w-10 h-10 text-primary mb-2" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          No TikTok profiles added yet
        </h2>
        <p className="max-w-md mx-auto">
          Connect your TikTok profile to start generating AI-powered content
          ideas. We'll use your videos and engagement data to help you create
          your next viral post.
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          You'll be asked to grant us permission to view your profile and recent
          videos — we only use this to generate content ideas tailored to your
          audience.
        </p>
        <Button size="lg" onClick={handleConnect}>
          <Sparkles className="w-4 h-4 mr-2" />
          Connect TikTok Profile
        </Button>
      </div>
    </div>
  );
}
