"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CopyCheck, Save, Check } from "lucide-react";
import { Idea } from "@/lib/types";
import { useToast } from "@/components/hooks/use-toast";
import { useSaveIdea } from "@/lib/hooks/use-save-idea";
import { useState } from "react";

interface GeneratedIdeasProps {
  ideas: Idea[];
  sourceId: string;
}

export default function GeneratedIdeas({
  ideas,
  sourceId,
}: GeneratedIdeasProps) {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useSaveIdea();
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
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

  const [savedIndexes, setSavedIndexes] = useState<number[]>([]);

  const handleSave = async (idea: Idea, index: number) => {
    if (savedIndexes.includes(index)) return; // ✅ Prevent double save

    setSavingIndex(index);
    try {
      await mutateAsync({
        title: idea.title,
        description: idea.description,
        source_id: sourceId,
        type: "YOUTUBE",
      });

      setSavedIndexes((prev) => [...prev, index]); // ✅ Mark as saved

      toast({
        title: "Saved!",
        description: "Your idea has been saved successfully.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save idea.",
        variant: "destructive",
      });
    } finally {
      setSavingIndex(null);
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSave(idea, i)}
                  disabled={
                    savedIndexes.includes(i) || (isPending && savingIndex === i)
                  }
                >
                  {savedIndexes.includes(i) ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      {isPending && savingIndex === i ? "Saving..." : "Save"}
                    </>
                  )}
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
