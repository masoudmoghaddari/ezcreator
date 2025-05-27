export type TikTokVideo = {
  id: string;
  profile_id: string;
  media_id: string;
  text: string;
  hashtags: string[];
  play_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  duration: number;
  cover_url: string;
  timestamp: Date;
  engagement_score: number;
  published_at: Date;
};

export type TikTokProfile = {
  id: string;
  tiktok_id: string;
  username: string;
  nickname: string;
  avatar_url: string;
  followers_count: number;
  videos_count: number;
  likes_received: number;
  region: string | null;
  profile_url: string;
  created_at: Date;
  updated_at: Date;
};
