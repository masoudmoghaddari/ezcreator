"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, Check, ClipboardCopy } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { Idea } from "@/lib/types";
import { useState } from "react";

interface IdeaCardProps {
  idea: Idea;
  index: number;
  onSave?: (idea: Idea) => Promise<void>;
  onRegenerate?: (idea: Idea) => void;
}

export function IdeaCard({ idea, index, onSave, onRegenerate }: IdeaCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${idea.title}\n\n${idea.description}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleSave = async () => {
    if (isSaved) return;
    setIsSaving(true);
    try {
      await onSave?.(idea);
      setIsSaved(true);
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
      setIsSaving(false);
    }
  };

  return (
    <Card className="hover:bg-muted transition-colors duration-200 rounded-sm">
      <CardContent className="py-4 space-y-2">
        <h3 className="font-semibold text-sm">{idea.title}</h3>
        <p className="text-sm text-muted-foreground">{idea.description}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? (
              <>
                <Check /> Copied!
              </>
            ) : (
              <>
                <ClipboardCopy /> Copy
              </>
            )}
          </Button>
          {onSave && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              disabled={isSaved || isSaving}
            >
              {isSaved ? (
                <>
                  <Check /> Saved
                </>
              ) : (
                <>
                  <Save />
                  {isSaving ? "Saving..." : "Save"}
                </>
              )}
            </Button>
          )}
          {onRegenerate && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRegenerate(idea)}
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
