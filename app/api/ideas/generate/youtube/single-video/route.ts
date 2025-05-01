import { NextRequest, NextResponse } from "next/server";
import { generateYoutubePromptForSingleVideo } from "@/app/api/ideas/helpers/prompts";
import { openai } from "@/utils/openai";
import { YoutubeVideoItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const {
      video,
      channelId,
      youtubeChannelName,
    }: {
      video: YoutubeVideoItem;
      channelId: string | null;
      youtubeChannelName: string | null;
    } = await req.json();

    if (!video) {
      return NextResponse.json(
        { error: "No video provided." },
        { status: 400 }
      );
    }

    const prompt = generateYoutubePromptForSingleVideo(
      video,
      youtubeChannelName
    );

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

    return NextResponse.json({ ideas });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate ideas." },
      { status: 500 }
    );
  }
}
