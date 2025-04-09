export type SortBy =
  | "views"
  | "likes"
  | "comments"
  | "title"
  | "duration"
  | "published_at"
  | "engagement_score";

export type SortOrder = "asc" | "desc";

export type Channel = {
  id: string;
  title: string;
  avatarUrl: string;
  syncedAt: Date;
};
