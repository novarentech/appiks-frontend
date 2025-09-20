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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Quote, Plus } from "lucide-react";
import { ContentItem } from "../ContentManagementTable";

interface CreateQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (quote: ContentItem) => void;
}

const publicationTargets = [
  "Hasil Mood Aman",
  "Hasil Mood Tidak Aman",
  "Daily Quotes",
  "Motivational Quotes",
];

export function CreateQuoteDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateQuoteDialogProps) {
  const [quoteContent, setQuoteContent] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationTarget, setPublicationTarget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!quoteContent.trim() || !author.trim() || !publicationTarget) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newQuote: ContentItem = {
        id: Date.now().toString(),
        title:
          quoteContent.length > 50
            ? quoteContent.substring(0, 50) + "..."
            : quoteContent,
        type: "Quotes",
        createdAt: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        content: quoteContent.trim(),
        author: author.trim(),
        category: publicationTarget,
      };

      onSuccess(newQuote);

      // Reset form
      setQuoteContent("");
      setAuthor("");
      setPublicationTarget("");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    setQuoteContent("");
    setAuthor("");
    setPublicationTarget("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Quote className="h-6 w-6 text-purple-600" />
            Buat Quote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Content */}
          <div>
            <Label htmlFor="quote-content" className="text-sm font-medium">
              Isi Quote <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="quote-content"
              value={quoteContent}
              onChange={(e) => setQuoteContent(e.target.value)}
              placeholder="Tuliskan isi quote disini. Contoh : Percayalah pada dirimu sendiri dan semua yang ada dalam..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="author" className="text-sm font-medium">
              Dikutip Oleh <span className="text-red-500">*</span>
            </Label>
            <Input
              id="author"
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
                <SelectValue placeholder="Hasil Mood Aman" />
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
            Tutup
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menambahkan...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Tambah
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
