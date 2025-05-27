"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TikTokProfile } from "@/lib/types";

interface ProfileSelectorProps {
  profiles: TikTokProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onAddNew: () => void;
  isLoading: boolean;
  isError: boolean;
}

export function ProfileSelector({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onAddNew,
  isLoading,
  isError,
}: ProfileSelectorProps) {
  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground py-6">
        Loading TikTok profiles...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500 py-6">Failed to load profiles.</div>
    );
  }

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      <Select value={selectedProfileId ?? ""} onValueChange={onSelectProfile}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a TikTok profile" />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              {profile.nickname}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={onAddNew}>
        Add New Profile
      </Button>
    </div>
  );
}
