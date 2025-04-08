import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

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
    },
  });

  return NextResponse.json(videos);
}
