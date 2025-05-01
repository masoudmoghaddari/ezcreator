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
import { Idea, YoutubeChannel, YoutubeVideoItem } from "@/lib/types";
import { useGenerateSingleVideoIdea } from "@/lib/hooks/youtube/use-generate-single-video-idea";
import { Spinner } from "@/components/ui/spinner";

const VIDEOS_PER_PAGE = 10;

interface VideoTableProps {
  videos: YoutubeVideoItem[];
  channel: YoutubeChannel;
  isLoading: boolean;
  isError: boolean;
  onSingleIdeaGenerationSuccess: (ideas: Idea[]) => void;
}

export function VideoTable({
  videos,
  channel,
  isLoading,
  isError,
  onSingleIdeaGenerationSuccess,
}: VideoTableProps) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(
    null
  );
  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const start = (currentPage - 1) * VIDEOS_PER_PAGE;
  const end = start + itemsPerPage;
  const paginatedVideos = videos.slice(start, start + VIDEOS_PER_PAGE);

  const { mutate: generateSingleVideoIdea, isPending: isGenerating } =
    useGenerateSingleVideoIdea({
      channelId: channel.id,
      onSuccess: (ideas) => {
        onSingleIdeaGenerationSuccess(ideas);
      },
    });

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
              <TableHead className="text-center">Thumbnail</TableHead>
              <TableHead>Title</TableHead>
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
                <TableCell className="text-center">
                  <img
                    src={video.thumbnail_url || ""}
                    alt="thumbnail"
                    className="w-12 h-auto rounded mx-auto"
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
                <TableCell className="text-center">
                  {video.view_count && video.view_count > 1000
                    ? `${(video.view_count / 1000).toFixed(0)}K`
                    : video.view_count}
                </TableCell>
                <TableCell className="text-center">
                  {video.like_count && video.like_count > 1000
                    ? `${(video.like_count / 1000).toFixed(0)}K`
                    : video.like_count}
                </TableCell>
                <TableCell className="text-center">
                  {video.comment_count && video.comment_count > 1000
                    ? `${(video.comment_count / 1000).toFixed(0)}K`
                    : video.comment_count}
                </TableCell>
                <TableCell className="text-center">
                  {formatDuration(video.duration)}
                </TableCell>
                <TableCell className="text-center">
                  {formatDateToYMD(video.published_at)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setGeneratingVideoId(video.id);
                      generateSingleVideoIdea(
                        {
                          video,
                          youtubeChannelName: channel.title,
                        },
                        {
                          onSettled: () => setGeneratingVideoId(null),
                        }
                      );
                    }}
                    disabled={isGenerating}
                  >
                    {isGenerating && generatingVideoId === video.id ? (
                      <Spinner className="w-3 h-3" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Inspire Me
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
