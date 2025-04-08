// app/api/youtube/preview/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";

function extractIdentifier(input: string) {
  let id = "";
  let handle = "";

  const cleaned = input.trim();

  if (cleaned.includes("/channel/")) {
    id = cleaned.split("/channel/")[1]?.split(/[/?&#]/)[0];
  } else if (cleaned.includes("/@")) {
    handle = cleaned.split("/@")[1]?.split(/[/?&#]/)[0];
  } else if (/^[A-Za-z0-9_-]{24}$/.test(cleaned)) {
    id = cleaned; // raw channel ID
  } else if (/^@?[a-zA-Z0-9._-]+$/.test(cleaned)) {
    handle = cleaned.replace(/^@/, ""); // allow raw or @handle
  }

  return { id, handle };
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return count.toString();
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, handle } = extractIdentifier(url);
    let apiUrl = "";

    if (id) {
      apiUrl = `${CHANNELS_URL}?part=snippet,statistics&id=${id}&key=${API_KEY}`;
    } else if (handle) {
      apiUrl = `${CHANNELS_URL}?part=snippet,statistics&forHandle=${handle}&key=${API_KEY}`;
    } else {
      return NextResponse.json(
        { error: "Could not resolve channel info" },
        { status: 400 }
      );
    }

    const res = await fetch(apiUrl);
    const data = await res.json();
    const snippet = data.items?.[0]?.snippet;
    const statistics = data.items?.[0]?.statistics;

    if (!snippet || !statistics) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: snippet.title,
      avatar: snippet.thumbnails?.default?.url || "",
      subscribers: formatCount(Number(statistics.subscriberCount || 0)),
      videos: formatCount(Number(statistics.videoCount || 0)),
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
