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
import { formatDateToYMD, formatDuration } from "@/lib/utils/date";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useState } from "react";
import { InstagramProfileVideo } from "@/lib/types";

const VIDEOS_PER_PAGE = 10;

interface VideoTableProps {
  videos: InstagramProfileVideo[];
  isLoading: boolean;
  isError: boolean;
}

export function VideoTable({ videos, isLoading, isError }: VideoTableProps) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCaptions, setExpandedCaptions] = useState<
    Record<string, boolean>
  >({});

  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const start = (currentPage - 1) * VIDEOS_PER_PAGE;
  const end = start + itemsPerPage;
  const paginatedVideos = videos.slice(start, start + VIDEOS_PER_PAGE);

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
    <>
      <div className="overflow-x-auto border rounded-md">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Caption</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead className="text-center">Likes</TableHead>
              <TableHead className="text-center">Comments</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead className="text-center min-w-[150px]">
                Publish date
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="max-w-[300px] text-sm text-muted-foreground">
                  <div className="flex flex-col">
                    <span
                      className={
                        video.caption &&
                        video.caption.length > 120 &&
                        !expandedCaptions[video.id]
                          ? "line-clamp-2"
                          : ""
                      }
                    >
                      {video.caption}
                    </span>
                    {video.caption && video.caption.length > 120 && (
                      <button
                        onClick={() =>
                          setExpandedCaptions((prev) => ({
                            ...prev,
                            [video.id]: !prev[video.id],
                          }))
                        }
                        className="text-xs text-primary mt-1 self-start"
                      >
                        {expandedCaptions[video.id] ? "Show less" : "View more"}
                      </button>
                    )}
                    {/* {video.topPick && (
                    <Badge variant="secondary" className="border">
                      Top Pick
                    </Badge>
                  )} */}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {video.view_count > 1000
                    ? `${(video.view_count / 1000).toFixed(0)}K`
                    : video.view_count}
                </TableCell>
                <TableCell className="text-center">
                  {video.like_count > 1000
                    ? `${(video.like_count / 1000).toFixed(0)}K`
                    : video.like_count}
                </TableCell>
                <TableCell className="text-center">
                  {video.comment_count > 1000
                    ? `${(video.comment_count / 1000).toFixed(0)}K`
                    : video.comment_count}
                </TableCell>
                <TableCell className="text-center">
                  {formatDuration(parseInt(video.duration.toString(), 10))}
                </TableCell>
                <TableCell className="text-center">
                  {formatDateToYMD(video.timestamp)}
                </TableCell>
                <TableCell className="text-center">
                  <Button size="sm" variant="outline">
                    <Sparkles className="w-3 h-3 mr-1" /> Inspire Me
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-4 mt-4">
          <div>
            <span className="text-sm text-muted-foreground">
              Showing {start + 1}–{Math.min(end, videos.length)} of{" "}
              {videos.length}
            </span>
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
