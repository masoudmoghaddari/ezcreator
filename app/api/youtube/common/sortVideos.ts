import {
  YoutubeVideoItem,
  InstagramProfileVideoItem,
  SortBy,
  SortOrder,
} from "@/lib/types";

export const sortYoutubeVideos = (
  videos: YoutubeVideoItem[],
  sortBy: SortBy,
  sortOrder: SortOrder
): YoutubeVideoItem[] => {
  return [...videos].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    const keyMap = {
      views: "view_count",
      likes: "like_count",
      comments: "comment_count",
      duration: "duration",
      published_at: "published_at",
      engagement_score: "engagement_score",
    } as const;

    const key = keyMap[sortBy as keyof typeof keyMap];

    if (key) {
      const aVal = a[key] ?? 0;
      const bVal = b[key] ?? 0;

      if (key === "published_at") {
        return sortOrder === "asc"
          ? new Date(aVal).getTime() - new Date(bVal).getTime()
          : new Date(bVal).getTime() - new Date(aVal).getTime();
      }

      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    }

    return 0;
  });
};

export const sortInstagramVideos = (
  videos: InstagramProfileVideoItem[],
  sortBy: SortBy,
  sortOrder: SortOrder
): InstagramProfileVideoItem[] => {
  return [...videos].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? (a.caption?.localeCompare(b.caption ?? "") ?? 0)
        : (b.caption?.localeCompare(a.caption ?? "") ?? 0);
    }

    const keyMap = {
      views: "view_count",
      likes: "like_count",
      comments: "comment_count",
      duration: "duration",
      published_at: "timestamp",
      engagement_score: "engagement_score",
    } as const;

    const key = keyMap[sortBy as keyof typeof keyMap];

    if (key) {
      const aVal = a[key] ?? 0;
      const bVal = b[key] ?? 0;

      if (key === "timestamp") {
        return sortOrder === "asc"
          ? new Date(aVal).getTime() - new Date(bVal).getTime()
          : new Date(bVal).getTime() - new Date(aVal).getTime();
      }

      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    }

    return 0;
  });
};
