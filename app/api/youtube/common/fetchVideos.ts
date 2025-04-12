const API_KEY = process.env.YOUTUBE_API_KEY!;
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

export async function fetchLatestVideoIds(
  channelId: string,
  max = 30
): Promise<string[]> {
  let videoIds: string[] = [];
  let nextPageToken: string | undefined = undefined;

  while (videoIds.length < max) {
    const remaining = max - videoIds.length;
    const fetchCount = remaining > 50 ? 50 : remaining;

    const url = new URL(SEARCH_URL);
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("part", "snippet,id");
    url.searchParams.set("order", "date");
    url.searchParams.set("maxResults", fetchCount.toString());
    url.searchParams.set("type", "video");
    if (nextPageToken) url.searchParams.set("pageToken", nextPageToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    const ids =
      data.items?.map((v: any) => v.id?.videoId).filter(Boolean) || [];
    videoIds.push(...ids);

    nextPageToken = data.nextPageToken;
    if (!nextPageToken) break;
  }

  return videoIds.slice(0, max);
}

export async function fetchVideoDetails(videoIds: string[]): Promise<any[]> {
  const results: any[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const idString = chunk.join(",");

    const res = await fetch(
      `${VIDEOS_URL}?part=snippet,statistics,contentDetails&id=${idString}&key=${API_KEY}`
    );
    const data = await res.json();
    results.push(...(data.items || []));
  }

  return results;
}

export function parseDuration(iso: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, h = "0", m = "0", s = "0"] = regex.exec(iso) || [];
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
}
