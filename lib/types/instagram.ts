export type InstagramProfile = {
  id: string;
  title: string;
  avatarUrl: string;
  syncedAt: Date;
};

export type InstagramProfileVideo = {
  id: string;
  profile_id: string;
  caption: string;
  thumbnail_url: string;
  timestamp: Date;
  like_count: number;
  comment_count: number;
  view_count: number;
  duration: number;
  engagement_score: number;
};
