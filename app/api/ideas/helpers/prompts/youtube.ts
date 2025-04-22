import { YoutubeVideoItem } from "@/lib/types";

export function generateYoutubePrompt(videos: YoutubeVideoItem[]) {
  const calculateScore = (video: YoutubeVideoItem) => {
    const views = video.view_count ?? 0;
    const likes = video.like_count ?? 0;
    const comments = video.comment_count ?? 0;
    return views * 0.6 + likes * 0.3 + comments * 0.1;
  };

  const topVideos = [...videos]
    .map((v) => ({
      ...v,
      engagement_score: calculateScore(v),
    }))
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 10);

  const videoLines = topVideos
    .map(
      (v, i) => `
${i + 1}. "${v.title}"
   - Views: ${v.view_count}
   - Likes: ${v.like_count}
   - Comments: ${v.comment_count}
   - Engagement Score: ${v.engagement_score.toFixed(2)}`
    )
    .join("\n");

  return `
You are a YouTube content strategist.

I will provide the 10 most engaging videos from a YouTube channel. Based on all of these 5 videos, generate 10 new and original content ideas that align with the channel's niche and have strong viral potential. 
Consider the current trends in social media and YouTube, and suggest ideas that are likely to resonate with the audience.
Use this data to understand what performs well.

Here are the top 5 videos:
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
