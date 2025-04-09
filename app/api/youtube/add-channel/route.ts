import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  fetchLatestVideoIds,
  fetchVideoDetails,
  parseDuration,
} from "../common/fetchVideos";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";

function extractIdentifier(input: string) {
  let id = "";
  let handle = "";

  const cleaned = input.trim();

  if (cleaned.includes("/channel/")) {
    id = cleaned.split("/channel/")[1]?.split(/[/?&#]/)[0];
  } else if (cleaned.includes("/@")) {
    handle = cleaned.split("/x@")[1]?.split(/[/?&#]/)[0];
  } else if (/^[A-Za-z0-9_-]{24}$/.test(cleaned)) {
    id = cleaned; // raw channel ID
  } else if (/^@?[a-zA-Z0-9._-]+$/.test(cleaned)) {
    handle = cleaned.replace(/^@/, "");
  }

  return { id, handle };
}

export async function POST(req: NextRequest) {
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

    const { url } = await req.json();
    const { id, handle } = extractIdentifier(url);

    let channelApiUrl = "";

    if (id) {
      channelApiUrl = `${CHANNELS_URL}?part=snippet&id=${id}&key=${API_KEY}`;
    } else if (handle) {
      channelApiUrl = `${CHANNELS_URL}?part=snippet&forHandle=${handle}&key=${API_KEY}`;
    } else {
      return NextResponse.json(
        { error: "Could not resolve channel" },
        { status: 400 }
      );
    }

    const res = await fetch(channelApiUrl);
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const channelId = item.id;
    const { title, thumbnails } = item.snippet;

    // Check for existing channel
    const existing = await prisma.youtubeChannel.findUnique({
      where: { channel_id: channelId },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `Channel ${existing.title} already exists. Please select it from your list.`,
        },
        { status: 409 }
      );
    }

    const savedChannel = await prisma.youtubeChannel.create({
      data: {
        channel_id: channelId,
        title: title.trim(),
        avatar_url: thumbnails?.default?.url || "",
        user: { connect: { id: dbUser.id } },
      },
    });

    // Fetch and store latest videos
    const videoIds = await fetchLatestVideoIds(channelId, 30); // switch to 30 in prod
    const videos = await fetchVideoDetails(videoIds);

    const videoEntries = videos.map((v: any) => ({
      video_id: v.id,
      title: v.snippet.title.trim(),
      description: v.snippet.description,
      thumbnail_url: v.snippet.thumbnails?.default?.url || null,
      duration: parseDuration(v.contentDetails.duration),
      view_count: parseInt(v.statistics.viewCount || "0"),
      like_count: parseInt(v.statistics.likeCount || "0"),
      tags: v.snippet.tags?.join(",") || null,
      comment_count: parseInt(v.statistics.commentCount || "0"),
      published_at: new Date(v.snippet.publishedAt),
      channel_id: savedChannel.id,
    }));

    await prisma.youtubeVideo.createMany({ data: videoEntries });

    return NextResponse.json({
      message: "Channel added",
      id: savedChannel.id,
      title: savedChannel.title,
      syncedAt: savedChannel.synced_at,
    });
  } catch (err) {
    console.error("Add Channel Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
