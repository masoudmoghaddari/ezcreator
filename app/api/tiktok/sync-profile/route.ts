import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { fetchTiktokVideosFromApify } from "@/app/api/tiktok/common/fetchTiktokVideos";
import { getLocalUserId } from "@/utils/getLocalUserId";
´
export async function POST(req: NextRequest) {
  try {
    const { profileId } = await req.json();

    const userIdResult = await getLocalUserId();
    if (userIdResult.unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = userIdResult.id;

    const profile = await prisma.tikTokProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const videos = await fetchTiktokVideosFromApify(profile.username);

    const videoEntries = videos.map((v: any) => ({
      profile_id: profile.id,
      video_id: v.id,
      text: v.text,
      hashtags: v.hashtags?.map((h: any) => h.name).join(",") || null,
      play_count: v.playCount,
      like_count: v.diggCount,
      comment_count: v.commentCount,
      share_count: v.shareCount,
      collect_count: v.collectCount,
      duration: v.videoMeta?.duration,
      cover_url: v.videoMeta?.coverUrl,
      video_url: v.webVideoUrl,
      published_at: new Date(v.createTimeISO),
    }));

    await prisma.tikTokVideo.createMany({ data: videoEntries });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
