// app/api/tiktok/profiles/route.ts

import { prisma } from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { external_id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    const profiles = await prisma.tikTokProfile.findMany({
      where: { user_id: dbUser.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        username: true,
        nickname: true,
        profile_url: true,
        profile_picture: true,
        verified: true,
        followers_count: true,
        total_likes: true,
        total_videos: true,
        synced_at: true,
      },
    });

    const formattedProfiles = profiles.map((profile) => ({
      id: profile.id,
      title: profile.nickname || profile.username, // prefer nickname
      avatarUrl: profile.profile_picture,
      profileUrl: profile.profile_url,
      followers: profile.followers_count ?? 0,
      likes: profile.total_likes ?? 0,
      videos: profile.total_videos ?? 0,
      verified: profile.verified,
      syncedAt: profile.synced_at,
    }));

    return NextResponse.json(formattedProfiles);
  } catch (err) {
    console.error("[TikTok Profiles Fetch Error]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
