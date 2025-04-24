import { NextRequest, NextResponse } from "next/server";
import { generateYoutubePrompt } from "@/app/api/ideas/helpers/prompts";
import { openai } from "@/utils/openai";
import { YoutubeVideoItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const {
      videos,
    }: {
      videos: YoutubeVideoItem[];
    } = await req.json();

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "No videos provided." },
        { status: 400 }
      );
    }

    const prompt = generateYoutubePrompt(videos);
    console.log("Generated prompt:", prompt);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert YouTube content strategist and data analyst. Your job is to study video performance, understand audience behavior, detect content trends, and generate original, high-engagement content ideas that align with a channel’s niche and have strong viral potential. Prioritize creativity, niche relevance, and trend-awareness.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const ideas = response.choices?.[0]?.message?.content || "";
    console.log("ideas length:", ideas.length);
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Idea generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate ideas." },
      { status: 500 }
    );
  }
}
