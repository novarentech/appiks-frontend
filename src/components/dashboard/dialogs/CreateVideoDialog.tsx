"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Upload, X } from "lucide-react";
import { ContentItem } from "../content-management-table";

interface CreateVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (video: ContentItem) => void;
}

const availableTags = [
  "Self Awareness",
  "Mindfulness",
  "Mental Health",
  "Bullying",
];

export function CreateVideoDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateVideoDialogProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const extractVideoTitle = (url: string): string => {
    // Simple title extraction based on URL pattern
    // In real implementation, you might want to use YouTube API
    if (url.includes("cara-menjaga-kondisi-emosional")) {
      return "Cara Menjaga Kondisi Emosional";
    } else if (url.includes("stop-intoleransi")) {
      return "Stop Intoleransi di Lingkungan Sekolah";
    }
    return "Video Title"; // Default title
  };

  const handleSubmit = async () => {
    if (!youtubeUrl.trim() || selectedTags.length === 0) {
      alert("Mohon lengkapi URL YouTube dan pilih minimal satu tag");
      return;
    }

    // Basic YouTube URL validation
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      alert("Mohon masukkan URL YouTube yang valid");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newVideo: ContentItem = {
        id: Date.now().toString(),
        title: extractVideoTitle(youtubeUrl),
        type: "Video",
        createdAt: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        url: youtubeUrl.trim(),
        category: selectedTags[0] || "Uncategorized",
      };

      onSuccess(newVideo);

      // Reset form
      setYoutubeUrl("");
      setSelectedTags([]);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    setYoutubeUrl("");
    setSelectedTags([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Play className="h-6 w-6 text-green-600" />
            Buat Video
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* YouTube URL Input */}
          <div>
            <Label htmlFor="youtube-url" className="text-sm font-medium">
              URL Youtube <span className="text-red-500">*</span>
            </Label>
            <Input
              id="youtube-url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://"
              className="mt-1 bg-gray-100"
            />
          </div>

          {/* Tags Section */}
          <div>
            <Label className="text-sm font-medium">
              Tags <span className="text-red-500">*</span>
            </Label>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-600 text-white px-3 py-1 hover:bg-blue-700"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-blue-200 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  className={
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "border-blue-300 text-blue-600 hover:bg-blue-50"
                  }
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Tutup
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting || !youtubeUrl.trim() || selectedTags.length === 0
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mengunggah...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Unggah
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
