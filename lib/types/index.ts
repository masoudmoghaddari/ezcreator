export type SortBy = "views" | "likes" | "comments" | "title";
export type SortOrder = "asc" | "desc";

export type Channel = {
  id: string;
  title: string;
  avatarUrl: string;
  syncedAt: Date;
};
