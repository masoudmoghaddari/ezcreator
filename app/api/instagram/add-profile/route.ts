import { NextRequest, NextResponse } from "next/server";
import { extractInstagramUsernameFromUrl } from "@/lib/utils/extractInstagramUsernameFromUrl";
import { ApifyClient } from "apify-client";
import { prisma } from "@/utils/prisma";
import { getLocalUserId } from "@/utils/getLocalUserId";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: "Missing Instagram URL" },
        { status: 400 }
      );
    }

    const username = extractInstagramUsernameFromUrl(url);
    if (!username) {
      return NextResponse.json(
        { error: "Invalid Instagram profile URL" },
        { status: 400 }
      );
    }

    const { unauthorized, id: user_id } = await getLocalUserId();
    if (unauthorized || !user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already added this profile
    const existing = await prisma.instagramProfile.findFirst({
      where: {
        user_id,
        username: username.toLowerCase(),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You've already added this profile." },
        { status: 409 }
      );
    }

    // Scrape data from Apify
    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    // Prepare Actor input
    const input = {
      username: [username],
      resultsLimit: 35,
    };

    // Run the Actor and wait for it to finish
    const run = await client
      .actor(process.env.APIFY_INSTAGRAM_POST_SCRAPER_ACTOR_ID!)
      .call(input);

    const { items: posts } = await client
      .dataset(run.defaultDatasetId)
      .listItems();

    const savedProfile = await prisma.instagramProfile.create({
      data: {
        user_id,
        username: username,
        synced_at: new Date(),
      },
    });

    const videos = posts.filter((p: any) => p.type.toLowerCase() === "video");

    const videoEntries = videos.map((v: any) => ({
      profile_id: savedProfile.id,
      media_id: v.id,
      media_url: v.url,
      shortcode: v.shortCode,
      caption: v.caption,
      hashtags: v.hashtags.join(", "),
      thumbnail_url: v.displayUrl ?? null,
      timestamp: new Date(v.timestamp),
      like_count: v.likesCount,
      comment_count: v.commentsCount,
      view_count: v.videoViewCount,
      duration: v.videoDuration,
    }));

    await prisma.instagramVideo.createMany({ data: videoEntries });
    // {
    //     id: savedProfile.id,
    //     title: savedProfile.username,
    //     avatarUrl: savedProfile.profile_picture,
    //     syncedAt: savedProfile.synced_at,
    //   }
    return NextResponse.json([]);
  } catch (err) {
    console.error("Add Instagram Profile Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
