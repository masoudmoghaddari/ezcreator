// app/api/ideas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const localUser = await prisma.user.findUnique({
    where: { external_id: user.id },
  });

  if (!localUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ideas = await prisma.generatedIdea.findMany({
    where: { user_id: localUser.id, type: "YOUTUBE" },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      created_at: true,
      type: true,
      source_id: true,
      context_id: true,
      youtubeChannel: {
        select: { title: true },
      },
    },
  });

  return NextResponse.json(ideas);
}
