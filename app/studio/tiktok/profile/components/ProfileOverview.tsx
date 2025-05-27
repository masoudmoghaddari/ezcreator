"use client";

import { Button } from "@/components/ui/button";
import { TikTokProfile } from "@/lib/types";
import { SortBy, SortOrder } from "@/lib/types";
import { RotateCw } from "lucide-react";

interface ProfileOverviewProps {
  selectedProfile: TikTokProfile;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  resyncFunction: () => Promise<void>;
  resyncIsPending: boolean;
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={selectedProfile.avatar_url}
            alt={selectedProfile.nickname}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {selectedProfile.nickname}
            </h2>
            <p className="text-sm text-muted-foreground">TikTok Profile</p>
          </div>
        </div>
        <Button
          onClick={resyncFunction}
          disabled={resyncIsPending}
          variant="secondary"
        >
          {resyncIsPending ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RotateCw className="w-4 h-4 mr-1" />
              Resync
            </>
          )}
        </Button>
      </div>

      {/* Videos Table and Sorting */}
      {children}
    </div>
  );
}
