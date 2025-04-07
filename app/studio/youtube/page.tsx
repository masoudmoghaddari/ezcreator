// app/studio/youtube/page.tsx

"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import AddChannelDialog from "./components/AddChannelDialog";
import ChannelSelector from "./components/ChannelSelector";
import ChannelOverview from "./components/ChannelOverview";
import GeneratedIdeas from "./components/GeneratedIdeas";
import VideoTable from "./components/VideoTable";
import { Button } from "@/components/ui/button";

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

  const handleAddChannel = (channel: { id: string; title: string }) => {
    setUserChannels([...userChannels, channel]);
    setSelectedChannel(channel);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <ChannelSelector
        channels={userChannels}
        selectedChannel={selectedChannel}
        onSelectChannel={setSelectedChannel}
        onOpenAddDialog={() => setShowAddDialog(true)}
      />

      <AddChannelDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddChannel={handleAddChannel}
      />

      <ChannelOverview
        selectedChannel={selectedChannel}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      >
        <VideoTable videos={sortedVideos} />
      </ChannelOverview>

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

      <GeneratedIdeas />
    </div>
  );
}
