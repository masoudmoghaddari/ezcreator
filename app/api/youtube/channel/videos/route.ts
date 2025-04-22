import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { YoutubeVideoItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channelId");

  if (!channelId) {
    return NextResponse.json({ error: "Missing channelId" }, { status: 400 });
  }

  const videos = await prisma.youtubeVideo.findMany({
    where: { channel_id: channelId },
    orderBy: { published_at: "desc" },
    select: {
      id: true,
      video_id: true,
      title: true,
      thumbnail_url: true,
      view_count: true,
      like_count: true,
      comment_count: true,
      published_at: true,
      duration: true,
    },
  });

  const videosWithScore: YoutubeVideoItem[] = [...videos].map((v) => ({
    ...v,
    engagement_score: parseFloat(
      (
        (v.view_count ?? 0) * 0.6 +
        (v.like_count ?? 0) * 0.3 +
        (v.comment_count ?? 0) * 0.1
      ).toFixed(2)
    ),
  }));

  return NextResponse.json(videosWithScore);
}
