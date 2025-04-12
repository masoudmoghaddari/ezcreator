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
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { Channel } from "@/lib/types";
import { YouTube } from "@/components/icons";

interface AddChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddChannel: (channel: Channel) => void;
}

async function fetchChannelPreview(url: string) {
  const res = await fetch("/api/youtube/channel/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok)
    throw new Error(
      "Failed fetching channel preview, no channel found with this ID or URL"
    );
  return res.json();
}

async function addChannelToDB(url: string): Promise<Channel> {
  const res = await fetch("/api/youtube/channel/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to add channel");
  }

  return data;
}

export default function AddChannelDialog({
  open,
  onOpenChange,
  onAddChannel,
}: AddChannelDialogProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const {
    data: preview,
    refetch,
    isFetching,
    error: previewError,
    isError: isPreviewError,
  } = useQuery({
    queryKey: ["channelPreview", url],
    queryFn: () => fetchChannelPreview(url),
    enabled: false,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: addChannelToDB,
    onSuccess: (data) => {
      console.log("Channel added:", data);
      onAddChannel({
        id: data.id,
        title: data.title,
        avatarUrl: data.avatarUrl,
        syncedAt: data.syncedAt,
      });
      toast({
        title: "Channel added",
        description: `${data.title} saved successfully.`,
        variant: "success",
      });
      setUrl("");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (url.trim().length > 3) {
        refetch();
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [url, refetch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3">
        <DialogHeader>
          <DialogTitle>Add a New YouTube Channel</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground m-0">
          Enter channel URL or username
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. @MrBeast or https://www.youtube.com/@MrBeast"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            onClick={() => mutation.mutate(url)}
            disabled={!preview || isFetching || mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <YouTube className="w-4 h-4 mr-2" />
            )}
            Add
          </Button>
        </div>

        {isFetching && (
          <p className="text-xs text-muted-foreground mt-2">
            Fetching preview...
          </p>
        )}

        {isPreviewError && (
          <p className="text-xs text-red-500 mt-2">
            {previewError instanceof Error
              ? previewError.message
              : "Could not fetch channel info"}
          </p>
        )}

        {preview && (
          <div className="mt-4 flex items-center gap-4">
            <img
              src={preview.avatar}
              alt="channel avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{preview.title}</p>
              <p className="text-xs text-muted-foreground">
                {preview.subscribers} subscribers • {preview.videos} videos
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
