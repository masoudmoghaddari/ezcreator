import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { generatePromptFromTopVideos } from "../../common/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { videos } = await req.json();

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "No videos provided." },
        { status: 400 }
      );
    }

    const prompt = generatePromptFromTopVideos(videos);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional YouTube strategist. Help creators generate viral content ideas.",
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
