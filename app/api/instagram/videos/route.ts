import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { getLocalUserId } from "@/utils/getLocalUserId";

export async function GET(req: NextRequest) {
  try {
    const localUser = await getLocalUserId();
    if (localUser.unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    }

    const profile = await prisma.instagramProfile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile || profile.user_id !== localUser.id) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const videos = await prisma.instagramVideo.findMany({
      where: {
        profile_id: profileId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json(videos);
  } catch (err) {
    console.error("Instagram videos fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
