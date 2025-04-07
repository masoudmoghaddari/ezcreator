// components/ChannelOverview.tsx

"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelOverviewProps {
  selectedChannel: { id: string; title: string };
  sortBy: string;
  sortOrder: string;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  children: React.ReactNode;
}

export default function ChannelOverview({
  selectedChannel,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  children,
}: ChannelOverviewProps) {
  return (
    <div className="border p-4 rounded-md">
      <div className="flex justify-between items-center gap-2 mb-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Viewing:{" "}
            <span className="font-medium">{selectedChannel.title}</span>
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            Last synced: 3 days ago
            <Button variant="link" size="sm" className="p-0 h-auto text-xs">
              <RefreshCcw className="w-3 h-3 mr-1" /> Refetch
            </Button>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <Select onValueChange={onSortByChange} defaultValue={sortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onSortOrderChange} defaultValue={sortOrder}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {children}
    </div>
  );
}
