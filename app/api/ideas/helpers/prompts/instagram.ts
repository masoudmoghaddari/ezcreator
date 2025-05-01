import { InstagramProfileVideoItem } from "@/lib/types";

export function generateInstagramPrompt(videos: InstagramProfileVideoItem[]) {
  const topVideos = [...videos]
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 10);

  const videosCount =
    process.env.NEXT_PUBLIC_NUMBER_OF_INSTAGRAM_TOP_VIDEOS_FOR_IDEA_GENERATION;
  const ideasCount = process.env.NUMBER_OF_IDEAS_TO_GENERATE;

  const videoLines = topVideos
    .map(
      (v, i) => `
${i + 1}-"${v.caption}". [Views: ${v.view_count}, Likes: ${v.like_count}, Comments: ${v.comment_count}, Engagement Score: ${v.engagement_score.toFixed(2)}]`
    )
    .join("\n");

  return `
Below are the top ${videosCount} most engaging videos from an Instagram profile. 
Your task is to generate **${ideasCount} unique content ideas**, with **one idea per video**, based on the video it was inspired by.
Each idea must:
- Be relevant to the video it was inspired by
- Align with the overall niche and audience of the channel
- Be fresh, original, creative, and have strong viral potential
- Optionally leverage trending topics or adjacent themes

Here are the top ${videosCount} videos:
${videoLines}

Engagement score formula: 60% views, 30% likes, 10% comments
Respond in the following JSON format:
[
  {
    "inspired_by": "Original video title",
    "title": "Idea title",
    "description": "Short description of the idea"
  }
]
You must return exactly ${ideasCount} ideas — one idea for each video.
`.trim();
}
