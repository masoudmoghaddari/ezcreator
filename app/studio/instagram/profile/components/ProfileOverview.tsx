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
import { SortBy, SortOrder } from "@/lib/types";

interface ProfileOverviewProps {
  selectedProfile: { id: string; username: string; synced_at: string };
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (value: SortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
  resyncFunction?: (id: string) => void;
  resyncIsPending?: boolean;
  children: React.ReactNode;
}

export function ProfileOverview({
  selectedProfile,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  resyncFunction,
  resyncIsPending,
  children,
}: ProfileOverviewProps) {
  const formattedDate = new Date(
    selectedProfile.synced_at
  ).toLocaleDateString();

  return (
    <div className="border p-4 rounded-md">
      <div className="flex justify-between items-center gap-2 mb-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Viewing:{" "}
            <span className="font-medium">@{selectedProfile.username}</span>
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            Last synced: {formattedDate}
            {resyncFunction && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs"
                disabled={resyncIsPending}
                onClick={() => resyncFunction(selectedProfile.id)}
              >
                <RefreshCcw className="w-3 h-3 mr-1" />{" "}
                {resyncIsPending ? "Syncing..." : "Refetch"}
              </Button>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <Select onValueChange={onSortByChange} value={sortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="published_at">Published</SelectItem>
              <SelectItem value="engagement_score">Engagement</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onSortOrderChange} value={sortOrder}>
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
