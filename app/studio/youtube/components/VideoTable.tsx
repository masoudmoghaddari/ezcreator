"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface VideoItem {
  id: string;
  title: string;
  thumbnail_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  topPick?: boolean;
}

interface VideoTableProps {
  videos: VideoItem[];
  isLoading: boolean;
  isError: boolean;
}

export function VideoTable({ videos, isLoading, isError }: VideoTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm px-4 py-6">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading videos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500 px-4 py-6">
        Could not load videos. Please try again.
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-4 py-6">
        No videos found for this channel.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Likes</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>
                <img
                  src={video.thumbnail_url || ""}
                  alt="thumbnail"
                  className="w-12 h-auto rounded"
                />
              </TableCell>
              <TableCell className="flex items-center gap-2">
                {video.title}
                {video.topPick && (
                  <Badge variant="secondary" className="border">
                    Top Pick
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {video.view_count > 1000
                  ? `${(video.view_count / 1000).toFixed(0)}K`
                  : video.view_count}
              </TableCell>
              <TableCell className="text-right">
                {video.like_count > 1000
                  ? `${(video.like_count / 1000).toFixed(0)}K`
                  : video.like_count}
              </TableCell>
              <TableCell className="text-right">
                {video.comment_count > 1000
                  ? `${(video.comment_count / 1000).toFixed(0)}K`
                  : video.comment_count}
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline">
                  <Sparkles className="w-3 h-3 mr-1" /> Inspire Me
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
