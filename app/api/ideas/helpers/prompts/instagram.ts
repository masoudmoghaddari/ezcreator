import { InstagramProfileVideo } from "@/lib/types";

export function generateInstagramPrompt(videos: InstagramProfileVideo[]) {
  const topVideos = [...videos]
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 10);

  const videosCount =
    process.env.NEXT_PUBLIC_NUMBER_OF_YOUTUBE_TOP_VIDEOS_FOR_IDEA_GENERATION;
  const ideasCount = process.env.NUMBER_OF_IDEAS_TO_GENERATE;

  const videoLines = topVideos
    .map(
      (v, i) => `
${i + 1}. "${v.caption}"
   - Views: ${v.view_count}
   - Likes: ${v.like_count}
   - Comments: ${v.comment_count}
   - Engagement Score: ${v.engagement_score.toFixed(2)}`
    )
    .join("\n");

  return `
You are a YouTube content strategist.
I will provide the ${videosCount} most engaging videos from a YouTube channel. 
Based on all ${videosCount} videos, do the following:
1. Analyze the channel's niche and audience.
2. Identify themes, formats, and styles that aligns with the channel's niche with and resonates with the audience.
3. Generate ${ideasCount} new, original and distinct content ideas that align with the channel's niche and have strong viral potential.
4. Consider the current trends in social media and YouTube, and suggest ideas that have high engagement potential.

Here are the top ${videosCount} videos:
${videoLines}

Engagement score is calculated as:
- 60% views
- 30% likes
- 10% comments

Respond in the following JSON format:
[
  {
    "title": "Idea title here",
    "description": "Short description of the video idea."
  }
]
`.trim();
}
