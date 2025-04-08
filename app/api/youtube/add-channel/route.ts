// app/api/youtube/add-channel/route.ts

import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

function extractIdentifier(input: string) {
  let id = "";
  let handle = "";

  const cleaned = input.trim();

  if (cleaned.includes("/channel/")) {
    id = cleaned.split("/channel/")[1]?.split(/[/?&#]/)[0];
  } else if (cleaned.includes("/@")) {
    handle = cleaned.split("/@")[1]?.split(/[/?&#]/)[0];
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
    const userId = dbUser.id;

    const { url } = await req.json();

    if (!url || !userId)
      return NextResponse.json({ error: "Missing input" }, { status: 400 });

    const { id, handle } = extractIdentifier(url);
    let apiUrl = "";

    if (id) {
      apiUrl = `${CHANNELS_URL}?part=snippet,statistics&id=${id}&key=${API_KEY}`;
    } else if (handle) {
      apiUrl = `${CHANNELS_URL}?part=snippet,statistics&forHandle=${handle}&key=${API_KEY}`;
    } else {
      return NextResponse.json(
        { error: "Could not resolve channel" },
        { status: 400 }
      );
    }

    const res = await fetch(apiUrl);
    const data = await res.json();
    const item = data.items?.[0];
    if (!item)
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    const channelId = item.id;
    const { title, thumbnails } = item.snippet;

    // Check if already exists
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
        user: { connect: { id: userId } },
      },
    });

    const videoCount = 3; // TODO: 3 for testing, change to 30 for production
    // Fetch videos
    const searchRes = await fetch(
      `${SEARCH_URL}?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${videoCount}&type=video`
    );
    const searchData = await searchRes.json();

    const videoIds = searchData.items.map((v: any) => v.id.videoId).join(",");

    const videosRes = await fetch(
      `${VIDEOS_URL}?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    const videosData = await videosRes.json();

    const videoEntries = videosData.items.map((v: any) => ({
      video_id: v.id.trim,
      title: v.snippet.title.trim(),
      description: v.snippet.description,
      thumbnail_url: v.snippet.thumbnails?.default?.url || null,
      duration: parseDuration(v.contentDetails.duration),
      view_count: parseInt(v.statistics.viewCount || "0"),
      like_count: parseInt(v.statistics.likeCount || "0"),
      dislike_count: 0,
      comment_count: parseInt(v.statistics.commentCount || "0"),
      published_at: new Date(v.snippet.publishedAt),
      channel_id: savedChannel.id,
    }));

    await prisma.youtubeVideo.createMany({ data: videoEntries });

    return NextResponse.json({
      message: "Channel added",
      id: savedChannel.id,
      title: savedChannel.title,
    });
  } catch (err) {
    console.error("Add Channel Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function parseDuration(iso: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, h = "0", m = "0", s = "0"] = regex.exec(iso) || [];
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
}
