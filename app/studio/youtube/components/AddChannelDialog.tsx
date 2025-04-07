// components/AddChannelDialog.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { useEffect, useState } from "react";

interface AddChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddChannel: (channel: { id: string; title: string }) => void;
}

export default function AddChannelDialog({
  open,
  onOpenChange,
  onAddChannel,
}: AddChannelDialogProps) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<{
    title: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url || !url.includes("youtube.com")) return;
      setPreview({
        title: "Fetched Channel Title",
        avatar:
          "https://yt3.googleusercontent.com/ytc/AGIKgqPxq6q-example=s88-c-k-c0x00ffffff-no-rj",
      });
    };
    const timeout = setTimeout(fetchPreview, 500);
    return () => clearTimeout(timeout);
  }, [url]);

  const handleAdd = () => {
    if (!preview) return;
    onAddChannel({ id: Date.now().toString(), title: preview.title });
    setUrl("");
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New YouTube Channel</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="e.g. https://www.youtube.com/@AliAbdaal"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={!preview}>
            <Youtube className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
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
                Preview fetched from YouTube
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
