// app/api/youtube/my-channels/route.ts

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { external_id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const channels = await prisma.youtubeChannel.findMany({
      where: { user_id: dbUser.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        avatar_url: true,
        synced_at: true,
      },
    });

    return NextResponse.json(channels);
  } catch (err) {
    console.error("Fetch Channels Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
