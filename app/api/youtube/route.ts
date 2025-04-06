import { NextResponse } from "next/server";

// Mock data - in a real app, this would come from YouTube API
const mockVideos = [
  {
    id: "1",
    thumbnail: "/placeholder.svg?height=120&width=200",
    title: "How to Build a Next.js Application",
    views: 45231,
    likes: 3200,
    comments: 342,
  },
  {
    id: "2",
    thumbnail: "/placeholder.svg?height=120&width=200",
    title: "React Hooks Explained",
    views: 32150,
    likes: 2800,
    comments: 256,
  },
  {
    id: "3",
    thumbnail: "/placeholder.svg?height=120&width=200",
    title: "Building UI Components with Tailwind CSS",
    views: 28760,
    likes: 2100,
    comments: 189,
  },
  {
    id: "4",
    thumbnail: "/placeholder.svg?height=120&width=200",
    title: "JavaScript Tips and Tricks",
    views: 52340,
    likes: 4100,
    comments: 378,
  },
  {
    id: "5",
    thumbnail: "/placeholder.svg?height=120&width=200",
    title: "Responsive Design Best Practices",
    views: 38920,
    likes: 3050,
    comments: 287,
  },
];

export async function GET(request: Request) {
  // Get the URL from the request
  const { searchParams } = new URL(request.url);
  const channelUrl = searchParams.get("channelUrl");

  // In a real app, you would validate the channelUrl and fetch real data
  // For now, we'll just simulate a delay and return mock data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json({ videos: mockVideos });
}
