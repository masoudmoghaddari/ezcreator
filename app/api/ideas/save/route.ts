import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLocalUserId } from "../../youtube/common/getLocalUserId";

const ideaSchema = z.object({
  title: z.string(),
  description: z.string(),
  source_id: z.string(),
  context_id: z.string().optional(),
  type: z.enum(["YOUTUBE"]),
});

export async function POST(req: NextRequest) {
  try {
    const localUser = await getLocalUserId();
    if (localUser.unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = ideaSchema.parse(body);

    const saved = await prisma.generatedIdea.create({
      data: {
        ...data,
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
