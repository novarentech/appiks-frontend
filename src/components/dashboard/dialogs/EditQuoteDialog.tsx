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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Quote, Save } from "lucide-react";
import { ContentItem } from "../ContentManagementTable";

interface EditQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: ContentItem | null;
  onSuccess: (quote: ContentItem) => void;
}

const publicationTargets = [
  "Hasil Mood Aman",
  "Hasil Mood Tidak Aman",
  "Daily Quotes",
  "Motivational Quotes",
];

export function EditQuoteDialog({
  open,
  onOpenChange,
  quote,
  onSuccess,
}: EditQuoteDialogProps) {
  const [quoteContent, setQuoteContent] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationTarget, setPublicationTarget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or quote changes
  useEffect(() => {
    if (open && quote) {
      setQuoteContent(quote.content || "");
      setAuthor(quote.author || "");
      setPublicationTarget(quote.category || "");
    } else if (!open) {
      // Reset form when dialog closes
      setQuoteContent("");
      setAuthor("");
      setPublicationTarget("");
    }
  }, [open, quote]);

  const handleSubmit = async () => {
    if (
      !quoteContent.trim() ||
      !author.trim() ||
      !publicationTarget ||
      !quote
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const updatedQuote: ContentItem = {
        ...quote,
        title:
          quoteContent.length > 50
            ? quoteContent.substring(0, 50) + "..."
            : quoteContent,
        content: quoteContent.trim(),
        author: author.trim(),
        category: publicationTarget,
      };

      onSuccess(updatedQuote);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    // Reset form to original values
    if (quote) {
      setQuoteContent(quote.content || "");
      setAuthor(quote.author || "");
      setPublicationTarget(quote.category || "");
    }
    onOpenChange(false);
  };

  // Don't render if no quote is selected
  if (!quote) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Quote className="h-6 w-6 text-purple-600" />
            Edit Quote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Content */}
          <div>
            <Label htmlFor="edit-quote-content" className="text-sm font-medium">
              Isi Quote <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="edit-quote-content"
              value={quoteContent}
              onChange={(e) => setQuoteContent(e.target.value)}
              placeholder="Tuliskan isi quote disini. Contoh : Percayalah pada dirimu sendiri dan semua yang ada dalam..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="edit-author" className="text-sm font-medium">
              Dikutip Oleh <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Tuliskan nama penulis quote disini"
              className="mt-1"
            />
          </div>

          {/* Publication Target */}
          <div>
            <Label className="text-sm font-medium">
              Dipublikasikan ke <span className="text-red-500">*</span>
            </Label>
            <Select
              value={publicationTarget}
              onValueChange={setPublicationTarget}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Pilih target publikasi" />
              </SelectTrigger>
              <SelectContent>
                {publicationTargets.map((target) => (
                  <SelectItem key={target} value={target}>
                    {target}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-3">
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
              isSubmitting ||
              !quoteContent.trim() ||
              !author.trim() ||
              !publicationTarget
            }
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
