"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { TikTokProfile } from "@/lib/types";
import { Tiktok } from "@/components/icons";
import { useAddTikTokProfile } from "@/lib/hooks/tiktok/use-add-tiktok-profile";

interface AddTiktokProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProfile: (profile: TikTokProfile) => void;
}

export default function AddTiktokProfileDialog({
  open,
  onOpenChange,
  onAddProfile,
}: AddTiktokProfileDialogProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const mutation = useAddTikTokProfile((data) => {
    onAddProfile(data);
    toast({
      title: "Profile added",
      description: `${data.nickname} saved successfully.`,
      variant: "success",
    });
    setUrl("");
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a TikTok Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          <Input
            placeholder="Enter FULL profile URL, e.g., https://www.tiktok.com/@username"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div
            className="p-4 text-sm text-destructive rounded-lg bg-red-50"
            role="alert"
          >
            Please ensure the profile URL is correct before proceeding.
          </div>

          <Button
            onClick={() => mutation.mutate(url)}
            disabled={
              mutation.isPending ||
              !/^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/?$/.test(url.trim())
            }
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Tiktok className="!w-5 !h-5 fill-white" />
            )}
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
