// app/studio/youtube/page.tsx

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, RefreshCcw, Youtube, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialChannels = [
  { id: "1", title: "Ali Abdaal" },
  { id: "2", title: "MrBeast" },
];

const dummyVideos = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  title: `Why I Quit Being a Doctor ${i + 1}`,
  views: 872000 - i * 5000,
  likes: 45000 - i * 1000,
  comments: 1200 - i * 50,
  thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  topPick: i < 3,
}));

export default function YoutubeStudioPage() {
  const [userChannels, setUserChannels] = useState(initialChannels);
  const [selectedChannel, setSelectedChannel] = useState(initialChannels[0]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newChannelUrl, setNewChannelUrl] = useState("");
  const [channelPreview, setChannelPreview] = useState<{
    title: string;
    avatar: string;
  } | null>(null);
  const [sortBy, setSortBy] = useState("views");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedVideos = [...dummyVideos].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    const numericFields = ["views", "likes", "comments"] as const;
    if (numericFields.includes(sortBy as any)) {
      const key = sortBy as keyof (typeof dummyVideos)[0];
      return sortOrder === "asc"
        ? (a[key] as number) - (b[key] as number)
        : (b[key] as number) - (a[key] as number);
    }

    return 0;
  });

  const handleAddChannel = () => {
    if (!channelPreview) return;
    const newChannel = {
      id: Date.now().toString(),
      title: channelPreview.title,
    };
    setUserChannels([...userChannels, newChannel]);
    setSelectedChannel(newChannel);
    setNewChannelUrl("");
    setChannelPreview(null);
    setShowAddDialog(false);
  };

  useEffect(() => {
    const fetchPreview = async () => {
      if (!newChannelUrl || !newChannelUrl.includes("youtube.com")) return;
      setChannelPreview({
        title: "Fetched Channel Title",
        avatar:
          "https://yt3.googleusercontent.com/ytc/AGIKgqPxq6q-example=s88-c-k-c0x00ffffff-no-rj",
      });
    };
    const delay = setTimeout(fetchPreview, 500);
    return () => clearTimeout(delay);
  }, [newChannelUrl]);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      {/* Channel Selector */}
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>Select a YouTube Channel</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Choose a channel below, or add a new one to analyze.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {userChannels.map((channel) => (
            <Button
              key={channel.id}
              variant={
                channel.id === selectedChannel.id ? "default" : "outline"
              }
              onClick={() => setSelectedChannel(channel)}
            >
              <Youtube className="w-4 h-4 mr-1" />
              {channel.title}
            </Button>
          ))}
          <Button variant="ghost" onClick={() => setShowAddDialog(true)}>
            ➕ Add New Channel
          </Button>
        </CardContent>
      </Card>
      {/* Add Channel Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New YouTube Channel</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="e.g. https://www.youtube.com/@AliAbdaal"
              value={newChannelUrl}
              onChange={(e) => setNewChannelUrl(e.target.value)}
            />
            <Button onClick={handleAddChannel} disabled={!channelPreview}>
              <Youtube className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
          {channelPreview && (
            <div className="mt-4 flex items-center gap-4">
              <img
                src={channelPreview.avatar}
                alt="channel avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{channelPreview.title}</p>
                <p className="text-xs text-muted-foreground">
                  Preview fetched from YouTube
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Channel Overview */}
      <div className="border p-4 rounded-md">
        {/* Recent Videos Table */}
        <div className="flex justify-between items-center gap-2 mb-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Viewing:{" "}
              <span className="font-medium">{selectedChannel.title}</span>
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              Last synced: 3 days ago
              <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                <RefreshCcw className="w-3 h-3 mr-1" /> Refetch
              </Button>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort by:</span>
            <Select onValueChange={setSortBy} defaultValue={sortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="comments">Comments</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
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

        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVideos.map((video, i) => (
              <TableRow key={i}>
                <TableCell>
                  <img
                    src={video.thumbnail}
                    alt="thumbnail"
                    className="w-12 h-auto rounded"
                  />
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  {video.title}
                  {video.topPick && (
                    <Badge variant="secondary" className="border">
                      Top Pick
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {(video.views / 1000).toFixed(0)}K
                </TableCell>
                <TableCell className="text-right">
                  {(video.likes / 1000).toFixed(0)}K
                </TableCell>
                <TableCell className="text-right">
                  {(video.comments / 1000).toFixed(1)}K
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    <Sparkles className="w-3 h-3 mr-1" /> Inspire Me
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Generate Instructions + Button */}
      <div className="text-center py-14">
        <Button size="lg">
          <Sparkles className="w-4 h-4 mr-2" /> Generate ideas from Top Picks
        </Button>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-3">
          We'll generate content ideas from top-performing videos of the
          selected channel.
        </p>
      </div>

      {/* Generated Ideas Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Generated Ideas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-4 space-y-2">
                <h3 className="font-semibold text-sm">
                  The Productivity Myth You Still Believe
                </h3>
                <p className="text-xs text-muted-foreground">
                  A video idea that explores common misconceptions about
                  productivity strategies.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    Copy
                  </Button>
                  <Button size="sm" variant="outline">
                    Save
                  </Button>
                  <Button size="sm" variant="ghost">
                    <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
