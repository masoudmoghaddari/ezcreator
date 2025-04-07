// components/VideoTable.tsx

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Video {
  id: number;
  title: string;
  views: number;
  likes: number;
  comments: number;
  thumbnail: string;
  topPick: boolean;
}

interface VideoTableProps {
  videos: Video[];
}

export default function VideoTable({ videos }: VideoTableProps) {
  return (
    <Table className="border">
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
                src={video.thumbnail}
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
              {(video.views / 1000).toFixed(0)}K
            </TableCell>
            <TableCell className="text-right">
              {(video.likes / 1000).toFixed(0)}K
            </TableCell>
            <TableCell className="text-right">
              {(video.comments / 1000).toFixed(1)}K
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
  );
}
