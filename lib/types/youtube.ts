export type Channel = {
  id: string;
  title: string;
  avatarUrl: string;
  syncedAt: Date;
};

export interface UserChannel {
  id: string;
  title: string;
  avatar_url: string;
  synced_at: string;
}

export interface ChannelVideo {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: Date;
  duration: number;
  engagement_score: number;
}
