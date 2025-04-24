import { NextRequest, NextResponse } from "next/server";
import { generateInstagramPrompt } from "@/app/api/ideas/helpers/prompts";
import { openai } from "@/utils/openai";
import { InstagramProfileVideo } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const {
      videos,
    }: {
      videos: InstagramProfileVideo[];
    } = await req.json();

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "No videos provided." },
        { status: 400 }
      );
    }

    const prompt = generateInstagramPrompt(videos);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional Instagram strategist. Help creators generate viral content ideas.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const ideas = response.choices?.[0]?.message?.content || "";

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Idea generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas." },
      { status: 500 }
    );
  }
}
