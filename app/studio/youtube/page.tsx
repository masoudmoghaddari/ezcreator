"use client";

import { useState } from "react";
import { Clipboard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useYoutubeData } from "@/lib/hooks/use-youtube-data";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function YouTubeAnalyzer() {
  const [channelUrl, setChannelUrl] = useState("");
  const [queryChannelUrl, setQueryChannelUrl] = useState("");

  // Use React Query hook to fetch data
  const { data, isLoading, isError, error } = useYoutubeData(queryChannelUrl);
  const videos = data?.videos || [];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setChannelUrl(text);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const fetchChannelInfo = () => {
    if (!channelUrl.trim()) return;
    setQueryChannelUrl(channelUrl);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const handleGenerateIdeas = (videoTitle: string) => {
    alert(`Generating ideas for: ${videoTitle}`);
    // In a real app, this would open another modal or navigate to another page
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Add a Youtube channel</h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          <div className="relative flex-grow">
            <Input
              placeholder="Enter YouTube channel URL or ID"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={fetchChannelInfo} disabled={isLoading}>
            Get Information
          </Button>
        </div>

        {isError && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            Error:{" "}
            {error instanceof Error ? error.message : "Failed to fetch data"}
          </div>
        )}

        {videos.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-24 h-auto rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(video.views)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(video.likes)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(video.comments)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateIdeas(video.title)}
                      >
                        Generate Ideas
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isLoading} onOpenChange={() => {}}>
          <DialogContent
            className="sm:max-w-md loading-dialog"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogTitle className="text-lg font-semibold">
              Loading YouTube Data
            </DialogTitle>
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <h3 className="text-lg font-medium">Fetching information</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Please wait while we retrieve data from the YouTube channel...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
