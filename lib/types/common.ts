export type SortBy =
  | "views"
  | "likes"
  | "comments"
  | "title"
  | "duration"
  | "published_at"
  | "engagement_score";

export type SortOrder = "asc" | "desc";

export interface VideoItem {
  id: string;
  title: string;
  thumbnail_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: Date;
  duration: number;
  topPick?: boolean;
  engagement_score?: number;
}
