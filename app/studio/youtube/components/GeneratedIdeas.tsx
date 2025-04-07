// components/GeneratedIdeas.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function GeneratedIdeas() {
  return (
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
  );
}
