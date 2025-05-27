import { getLocalUserId } from "@/utils/getLocalUserId";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ideaSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoId: z.string(),
  youtubeChannelId: z.string().optional().nullable(),
  instagramProfileId: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const localUser = await getLocalUserId();
    if (localUser.unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = ideaSchema.parse(body);
    console.log("Save Idea Data:", data);

    const saved = await prisma.generatedIdea.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        youtube_video_id: data.videoId ?? null,
        youtube_channel_id: data.youtubeChannelId ?? null,
        instagram_profile_id: data.instagramProfileId ?? null,
        user_id: localUser.id,
      },
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    console.error("Save Idea Error:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
