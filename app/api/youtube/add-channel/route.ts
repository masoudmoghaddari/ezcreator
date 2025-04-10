import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  fetchLatestVideoIds,
  fetchVideoDetails,
  parseDuration,
} from "../common/fetchVideos";
import { getLocalUserId } from "../common/getLocalUserId";
import { extractIdentifier } from "./extractIdentifier";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";

export async function POST(req: NextRequest) {
  try {
    const localUser = await getLocalUserId();
    if (localUser.unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      where: {
        user_id_channel_id: {
          channel_id: channelId,
          user_id: localUser.id,
        },
      },
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
        user: { connect: { id: localUser.id } },
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
      user_id: localUser.id,
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
