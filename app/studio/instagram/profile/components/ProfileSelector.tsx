"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Profile {
  id: string;
  username: string;
}

interface ProfileSelectorProps {
  profiles: Profile[];
  isLoading: boolean;
  isError: boolean;
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onAddNew: () => void;
}

export function ProfileSelector({
  profiles,
  isLoading,
  isError,
  selectedProfileId,
  onSelectProfile,
  onAddNew,
}: ProfileSelectorProps) {
  return (
    <div className="flex gap-2 justify-between items-center mb-4">
      {isLoading ? (
        <Skeleton className="h-10 w-64 rounded-md" />
      ) : isError ? (
        <p className="text-sm text-red-500">Failed to load profiles.</p>
      ) : (
        <Select value={selectedProfileId ?? ""} onValueChange={onSelectProfile}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a profile" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button variant="outline" onClick={onAddNew}>
        <Plus className="w-4 h-4" />
        Add Profile
      </Button>
    </div>
  );
}
