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
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Upload } from "lucide-react";
import { ContentItem } from "../content-management-table";
import { Editor } from "@/components/blocks/editor-00/editor";
import { EditorState, SerializedEditorState } from "lexical";
import Image from "next/image";
import { toast } from "sonner";

interface EditArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: ContentItem | null;
  onSuccess: (article: ContentItem) => void;
}

const availableTags = [
  "Self Awareness",
  "Mindfulness",
  "Mental Health",
  "Bullying",
];

export function EditArticleDialog({
  open,
  onOpenChange,
  article,
  onSuccess,
}: EditArticleDialogProps) {
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [content, setContent] = useState("");
  const [editorState, setEditorState] = useState<EditorState | undefined>();
  const [serializedEditorState, setSerializedEditorState] = useState<
    SerializedEditorState | undefined
  >();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (article && open) {
      setTitle(article.title);
      setOverview("Self-awareness sebagai kunci keseimbangan hidup siswa.");
      setContent(article.content || "");
      setSelectedTags(article.category ? [article.category] : []);
      setExistingImage(article.thumbnail || "");
      setUploadedImage(null);
    }
  }, [article, open]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error(
          `Ukuran file terlalu besar. Maksimal 5MB. File Anda: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB`
        );
        // Reset the input
        event.target.value = "";
        return;
      }

      // Check file format
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Format file tidak didukung. Hanya JPG, PNG, dan WebP yang diperbolehkan."
        );
        // Reset the input
        event.target.value = "";
        return;
      }

      setUploadedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setExistingImage("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !overview.trim() || !content.trim() || !article) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const updatedArticle: ContentItem = {
        ...article,
        title: title.trim(),
        content: content.trim(),
        category: selectedTags[0] || "Uncategorized",
        thumbnail: uploadedImage
          ? URL.createObjectURL(uploadedImage)
          : existingImage,
      };

      onSuccess(updatedArticle);
      
      // Show success toast
      toast.success("Artikel berhasil diperbarui!");
      
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    if (article) {
      setTitle(article.title);
      setOverview("Self-awareness sebagai kunci keseimbangan hidup siswa.");
      setContent(article.content || "");
      setSelectedTags(article.category ? [article.category] : []);
      setExistingImage(article.thumbnail || "");
      setUploadedImage(null);
    }
    onOpenChange(false);
  };

  if (!article) return null;

  const displayImage = uploadedImage
    ? URL.createObjectURL(uploadedImage)
    : existingImage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl font-semibold">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            Edit Artikel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  Gambar / Thumbnail
                </Label>
                <div className="mt-2">
                  {displayImage ? (
                    <div className="space-y-3">
                      <div className="relative group">
                        <Image
                          src={displayImage}
                          alt="Preview"
                          width={400}
                          height={200}
                          className="w-full aspect-video object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <button
                            onClick={handleRemoveImage}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                        {uploadedImage ? (
                          <>
                            <div className="font-medium">
                              {uploadedImage.name}
                            </div>
                            <div>
                              {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-medium">Gambar artikel</div>
                            <div>Gambar saat ini</div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-8 text-center transition-colors duration-200 bg-gray-50 hover:bg-blue-50">
                      <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                      <div>
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-blue-600 hover:text-blue-700 font-medium">
                            Klik untuk upload gambar
                          </span>
                          <p className="text-sm text-muted-foreground mt-1">
                            atau seret dan lepas file di sini
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Maksimal 5MB • JPG, PNG, WebP
                          </p>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="title"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Judul Artikel
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Self-Awareness untuk Siswa: Kunci Hidup Sehat & Bahagia"
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label
                  htmlFor="overview"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Ringkasan Artikel
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <Textarea
                  id="overview"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Berikan ringkasan singkat tentang artikel ini yang akan menarik perhatian pembaca..."
                  className="mt-2 min-h-[100px] resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                Tag
                <span className="text-red-500 text-xs">*</span>
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
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">
                  Pilih kategori yang sesuai:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant={
                        selectedTags.includes(tag) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTagToggle(tag)}
                      className={
                        selectedTags.includes(tag)
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                      }
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                Isi Artikel
                <span className="text-red-500 text-xs">*</span>
              </Label>

              <div className="border rounded-lg shadow-sm">
                <Editor
                  editorState={editorState}
                  editorSerializedState={serializedEditorState}
                  onChange={setEditorState}
                  onSerializedChange={(serialized) => {
                    setSerializedEditorState(serialized);
                    const plainText = JSON.stringify(serialized);
                    setContent(plainText);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6 border-t gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !title.trim() ||
              !overview.trim() ||
              !content.trim() ||
              selectedTags.length === 0
            }
            className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
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
