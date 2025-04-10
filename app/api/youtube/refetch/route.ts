import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  fetchLatestVideoIds,
  fetchVideoDetails,
  parseDuration,
} from "../common/fetchVideos";
import { getLocalUserId } from "../common/getLocalUserId";

export async function POST(req: NextRequest) {
  try {
    const localUser = await getLocalUserId();
    if (localUser.unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { channelDbId } = await req.json();

    if (!channelDbId)
      return NextResponse.json({ error: "Missing channelId" }, { status: 400 });

    const channel = await prisma.youtubeChannel.findFirst({
      where: { id: channelDbId, user: { id: localUser.id } },
    });

    if (!channel)
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    const videoIds = await fetchLatestVideoIds(channel.channel_id, 30);
    const videos = await fetchVideoDetails(videoIds);

    let added = 0;
    let updated = 0;

    for (const v of videos) {
      const existing = await prisma.youtubeVideo.findUnique({
        where: { video_id: v.id },
      });

      const videoData = {
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
        channel_id: channel.id,
        user_id: localUser.id,
      };

      if (!existing) {
        await prisma.youtubeVideo.create({ data: videoData });
        added++;
      } else {
        await prisma.youtubeVideo.update({
          where: { video_id: v.id },
          data: {
            view_count: videoData.view_count,
            like_count: videoData.like_count,
            comment_count: videoData.comment_count,
            updated_at: new Date(),
          },
        });
        updated++;
      }
    }

    // Update synced_at
    await prisma.youtubeChannel.update({
      where: { id: channel.id },
      data: { synced_at: new Date() },
    });

    return NextResponse.json({
      message: "Refetch complete",
      added,
      updated,
    });
  } catch (err) {
    console.error("Refetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
