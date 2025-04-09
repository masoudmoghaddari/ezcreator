"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from "lucide-react";
import { Idea } from "@/lib/types";

interface GeneratedIdeasProps {
  ideas: Idea[];
}

export default function GeneratedIdeas({ ideas }: GeneratedIdeasProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (idea: Idea, index: number) => {
    const text = `${idea.title}\n\n${idea.description}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // reset after 2s
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (!ideas || ideas.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Generated Ideas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea, i) => (
          <Card key={i}>
            <CardContent className="py-4 space-y-2">
              <h3 className="font-semibold text-sm">{idea.title}</h3>
              <p className="text-sm text-muted-foreground">
                {idea.description}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCopy(idea, i)}
                >
                  {copiedIndex === i ? (
                    <>
                      <Check className="w-3 h-3 mr-1" /> Copied!
                    </>
                  ) : (
                    "Copy"
                  )}
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
