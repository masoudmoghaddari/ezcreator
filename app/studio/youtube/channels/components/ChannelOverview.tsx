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
import { timeAgo } from "@/lib/utils/date";
import { Channel, SortBy, SortOrder } from "@/lib/types";
import { useToast } from "@/components/hooks/use-toast";

interface ChannelOverviewProps {
  selectedChannel: Channel;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (value: SortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
  children: React.ReactNode;
  resyncFunction: (channelId: string) => Promise<void>;
  resyncIsPending: boolean;
}

export default function ChannelOverview({
  selectedChannel,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  children,
  resyncFunction,
  resyncIsPending,
}: ChannelOverviewProps) {
  const { toast } = useToast();

  const handleRefetch = async () => {
    try {
      await resyncFunction(selectedChannel.id);
      toast({
        title: "Refetch Complete",
        description: "Channel data has been updated.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border p-4 rounded-md">
      <div className="flex justify-between items-center gap-2 mb-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Viewing:{" "}
            <span className="font-medium">{selectedChannel.title}</span>
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            Last synced: {timeAgo(new Date(selectedChannel.syncedAt))}
            <Button
              variant="link"
              size="sm"
              className="p-2 h-auto text-xs gap-1"
              disabled={resyncIsPending}
              onClick={handleRefetch}
            >
              <RefreshCcw className="w-3 h-3 mr-1" />
              {resyncIsPending ? "Refetching..." : "Refetch"}
            </Button>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <Select onValueChange={onSortByChange} defaultValue={sortBy}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement_score">Engagement score</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="published_at">Publish date</SelectItem>
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
