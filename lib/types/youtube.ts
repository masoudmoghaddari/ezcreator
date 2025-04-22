export type YoutubeChannel = {
  id: string;
  title: string;
  avatarUrl: string;
  syncedAt: Date;
};

export interface YoutubeUserChannel {
  id: string;
  title: string;
  avatar_url: string;
  synced_at: Date;
}

export interface YoutubeVideoItem {
  id: string;
  title: string;
  video_id: string;
  thumbnail_url: string | null;
  view_count: number | null;
  like_count: number | null;
  comment_count: number | null;
  published_at: Date;
  duration: number | null;
  topPick?: boolean;
  engagement_score?: number;
}

export type YoutubeIdea = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  source_id: string;
  youtubeChannel: {
    title: string;
  };
};
