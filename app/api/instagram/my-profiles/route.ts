import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getLocalUserId } from "@/utils/getLocalUserId";

export async function GET() {
  try {
    const localUser = await getLocalUserId();
    if (localUser.unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const channels = await prisma.instagramProfile.findMany({
      where: { user_id: localUser.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        username: true,
        synced_at: true,
      },
    });

    return NextResponse.json(channels);
  } catch (err) {
    console.error("Fetch Channels Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
