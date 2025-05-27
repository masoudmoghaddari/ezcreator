"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TikTokVideo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatDateToYMD, formatDuration } from "@/lib/utils/date";

interface VideoTableProps {
  videos: TikTokVideo[];
  isLoading: boolean;
  isError: boolean;
}

export function VideoTable({ videos, isLoading, isError }: VideoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;
  const totalPages = Math.ceil(videos.length / videosPerPage);

  const start = (currentPage - 1) * videosPerPage;
  const paginatedVideos = videos.slice(start, start + videosPerPage);

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
        No TikTok videos found for this profile.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead>Caption</TableHead>
            <TableHead className="text-center">Views</TableHead>
            <TableHead className="text-center">Likes</TableHead>
            <TableHead className="text-center">Comments</TableHead>
            <TableHead className="text-center">Shares</TableHead>
            <TableHead className="text-center">Publish date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedVideos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>{video.text}</TableCell>
              <TableCell className="text-center">{video.play_count}</TableCell>
              <TableCell className="text-center">{video.like_count}</TableCell>
              <TableCell className="text-center">
                {video.comment_count}
              </TableCell>
              <TableCell className="text-center">{video.share_count}</TableCell>
              <TableCell className="text-center">
                {formatDateToYMD(video.published_at)}
              </TableCell>
              <TableCell className="text-center">
                <Button size="sm" variant="outline">
                  <Sparkles className="w-4 h-4 mr-1" /> Inspire Me
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <div className="space-x-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <Button
                key={idx}
                variant={idx + 1 === currentPage ? "default" : "secondary"}
                size="sm"
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
