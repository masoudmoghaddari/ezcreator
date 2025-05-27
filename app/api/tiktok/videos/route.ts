import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get("profileId");

  if (!profileId) {
    return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
  }

  const videos = await prisma.tikTokVideo.findMany({
    where: { profile_id: profileId },
    orderBy: { published_at: "desc" },
  });

  return NextResponse.json(videos);
}
