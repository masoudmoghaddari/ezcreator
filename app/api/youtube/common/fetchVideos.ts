const API_KEY = process.env.YOUTUBE_API_KEY!;
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

export async function fetchLatestVideoIds(
  channelId: string,
  max = 30
): Promise<string[]> {
  const searchRes = await fetch(
    `${SEARCH_URL}?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${max}&type=video`
  );
  const searchData = await searchRes.json();
  return searchData.items?.map((v: any) => v.id.videoId).filter(Boolean) || [];
}

export async function fetchVideoDetails(videoIds: string[]): Promise<any[]> {
  const idString = videoIds.join(",");
  const res = await fetch(
    `${VIDEOS_URL}?part=snippet,statistics,contentDetails&id=${idString}&key=${API_KEY}`
  );
  const data = await res.json();
  return data.items || [];
}

export function parseDuration(iso: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, h = "0", m = "0", s = "0"] = regex.exec(iso) || [];
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
}
