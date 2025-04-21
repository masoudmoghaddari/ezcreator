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
import { InstagramProfile } from "@/lib/types";
import { Instagram } from "@/components/icons";
import { useAddInstagramProfile } from "@/lib/hooks/instagram/use-add-instagram-profile";

interface AddInstagramProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProfile: (profile: InstagramProfile) => void;
}

export default function AddInstagramProfileDialog({
  open,
  onOpenChange,
  onAddProfile,
}: AddInstagramProfileDialogProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const mutation = useAddInstagramProfile((data) => {
    onAddProfile(data);
    toast({
      title: "Profile added",
      description: `${data.title} saved successfully.`,
      variant: "success",
    });
    setUrl("");
    onOpenChange(false);
  });

  const isUrlValid =
    /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?(?:\?.*)?$/.test(
      url.trim()
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an Instagram Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          <Input
            placeholder="Enter FULL profile URL, example: https://instagram.com/ezcreator"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={mutation.isPending}
          />

          <div
            className="p-4 text-sm text-destructive rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            Please make sure the profile URL is correct before continuing.
          </div>

          <Button
            onClick={() => mutation.mutate(url)}
            disabled={mutation.isPending || !isUrlValid}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Profile...
              </>
            ) : (
              <>
                <Instagram className="w-4 h-4 fill-white" />
                Add
              </>
            )}
          </Button>
        </div>

        {mutation.isPending && (
          <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex flex-col items-center justify-center text-center px-4 rounded-md">
            <Loader2 className="w-6 h-6 animate-spin text-primary mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Fetching profile info… <br />
              This may take up to 1 minute. DO NOT LEAVE this page.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
