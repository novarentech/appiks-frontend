"use client";

import React, { useState, useEffect } from "react";
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
import { Edit, Save, X } from "lucide-react";
import { ContentItem } from "@/components/data-display/tables/ContentManagementTable";
import { Tag } from "@/types/api";

interface EditVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: ContentItem | null;
  tags: Tag[];
  tagsLoading: boolean;
  onSuccess: (video: ContentItem) => void;
}

export function EditVideoDialog({
  open,
  onOpenChange,
  video,
  tags,
  tagsLoading,
  onSuccess,
}: EditVideoDialogProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (video && open) {
      setYoutubeUrl(video.url || "");
      setSelectedTags(video.category ? [video.category] : []);
    }
  }, [video, open]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!youtubeUrl.trim() || selectedTags.length === 0 || !video) {
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
      const updatedVideo: ContentItem = {
        ...video,
        url: youtubeUrl.trim(),
        category: selectedTags[0] || "Uncategorized",
      };

      onSuccess(updatedVideo);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    if (video) {
      setYoutubeUrl(video.url || "");
      setSelectedTags(video.category ? [video.category] : []);
    }
    onOpenChange(false);
  };

  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="h-6 w-6 text-blue-600" />
            Edit Video
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
            <div className="border rounded-lg p-3 bg-gray-50 min-h-[60px] mt-3">
              {tagsLoading ? (
                <div className="text-sm text-muted-foreground flex items-center justify-center h-10">
                  Memuat tag...
                </div>
              ) : tags.length === 0 ? (
                <div className="text-sm text-muted-foreground flex items-center justify-center h-10">
                  Tidak ada tag tersedia
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant={selectedTags.includes(tag.title) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagToggle(tag.title)}
                      className={
                        selectedTags.includes(tag.title)
                          ? "bg-blue-600 text-white"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                      }
                    >
                      {tag.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Batal
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
                Memperbarui...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Perbarui
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
