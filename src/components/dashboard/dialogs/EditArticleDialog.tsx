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
import { Editor } from "@/components/blocks/editor-00/editor";
import { EditorState, SerializedEditorState } from "lexical";
import Image from "next/image";
import { toast } from "sonner";
import { ContentItem } from "@/components/data-display/tables/ContentManagementTable";
import { Tag, ArticleDetail } from "@/types/api";
import { useArticleDetailById } from "@/hooks/useArticleDetail";
import { updateArticle } from "@/lib/api";

interface UpdateArticleData {
  title: string;
  description: string;
  content: string;
  tags: number[];
  thumbnail?: File;
}

interface EditArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: ContentItem | null;
  tags: Tag[];
  tagsLoading: boolean;
  onSuccess: (article: ContentItem) => void;
}

export function EditArticleDialog({
  open,
  onOpenChange,
  article,
  tags,
  tagsLoading,
  onSuccess,
}: EditArticleDialogProps) {
  // Form state
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedTagTitles, setSelectedTagTitles] = useState<string[]>([]);
  
  // Editor state
  const [editorState, setEditorState] = useState<EditorState | undefined>();
  const [serializedEditorState, setSerializedEditorState] = useState<
    SerializedEditorState | undefined
  >();
  const [editorKey, setEditorKey] = useState(0);
  
  // Image state
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setDetailArticle] = useState<ArticleDetail | null>(null);

  // API hooks
  const shouldFetchArticle = open && article?.ids;
  const {
    data: articleData,
    loading: articleLoading,
    error: articleError,
  } = useArticleDetailById(shouldFetchArticle ? article.ids! : null, open);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Populate form when article data is loaded
  useEffect(() => {
    if (articleData && open) {
      populateFormFromArticle(articleData);
    }
  }, [articleData, open]);

  const resetForm = () => {
    setTitle("");
    setOverview("");
    setContent("");
    setEditorState(undefined);
    setSerializedEditorState(undefined);
    setSelectedTags([]);
    setSelectedTagTitles([]);
    setUploadedImage(null);
    setExistingImage("");
    setDetailArticle(null);
    setEditorKey((prev) => prev + 1);
  };

  const populateFormFromArticle = (data: ArticleDetail) => {
    setTitle(data.title);
    setOverview(data.description);

    try {
      const parsedContent = typeof data.content === "string" 
        ? JSON.parse(data.content) 
        : data.content as SerializedEditorState;

      setSerializedEditorState(parsedContent);
      setContent(JSON.stringify(parsedContent));
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error parsing article content:", error);
      console.log("Raw content:", data.content);
    }

    setExistingImage(data.thumbnail);

    const tagIds = data.tags.map((tag) => tag.id);
    const tagTitles = data.tags.map((tag) => tag.title);
    setSelectedTags(tagIds);
    setSelectedTagTitles(tagTitles);
    setUploadedImage(null);
    setDetailArticle(data);
  };

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag.id)
        ? prev.filter((t) => t !== tag.id)
        : [...prev, tag.id]
    );
    setSelectedTagTitles((prev) =>
      prev.includes(tag.title)
        ? prev.filter((t) => t !== tag.title)
        : [...prev, tag.title]
    );
  };

  const handleTagRemove = (tagTitle: string) => {
    const tag = tags.find((t) => t.title === tagTitle);
    if (tag) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag.id));
      setSelectedTagTitles((prev) => prev.filter((t) => t !== tagTitle));
    }
  };

  const validateImageFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      toast.error(
        `Ukuran file terlalu besar. Maksimal 5MB. File Anda: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Format file tidak didukung. Hanya JPG, PNG, dan WebP yang diperbolehkan."
      );
      return false;
    }

    return true;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateImageFile(file)) {
      setUploadedImage(file);
    }
    // Reset input regardless of validation result
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setExistingImage("");
  };

  const validateForm = (): boolean => {
    return !!(
      title.trim() &&
      overview.trim() &&
      content.trim() &&
      article?.ids
    );
  };

  const prepareUpdateData = (): UpdateArticleData => {
    const updateData: UpdateArticleData = {
      title: title.trim(),
      description: overview.trim(),
      content: content.trim(),
      tags: selectedTags,
    };

    if (uploadedImage) {
      updateData.thumbnail = uploadedImage;
    }

    return updateData;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !article?.ids) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = prepareUpdateData();
      const response = await updateArticle(articleData!.id, updateData);

      if (response.success) {
        const updatedArticle: ContentItem = {
          ...article,
          title: response.data.title,
          content: response.data.content,
          category: selectedTagTitles[0] || "Uncategorized",
          thumbnail: uploadedImage
            ? URL.createObjectURL(uploadedImage)
            : response.data.thumbnail,
        };

        onOpenChange(false);
        onSuccess(updatedArticle);
        toast.success("Artikel berhasil diperbarui!");
      } else {
        toast.error(response.message || "Gagal memperbarui artikel");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui artikel"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (articleData) {
      populateFormFromArticle(articleData);
    }
    onOpenChange(false);
  };

  const getErrorMessage = (error: string): string => {
    if (error.includes("403")) {
      return "Akses ditolak. Anda tidak memiliki izin untuk mengakses artikel ini.";
    }
    if (error.includes("404")) {
      return "Artikel tidak ditemukan. Mungkin artikel telah dihapus atau ID tidak valid.";
    }
    if (error.includes("Failed to fetch")) {
      return "Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi.";
    }
    return error;
  };

  if (!article) return null;

  if (articleLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Artikel</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data artikel...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (articleError) {
    const errorMessage = getErrorMessage(articleError);
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Artikel</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-64">
            <div className="text-center max-w-md">
              <div className="text-red-500 mb-2">Error</div>
              <div className="text-gray-600 mb-4">{errorMessage}</div>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mt-2"
              >
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const displayImage = uploadedImage
    ? URL.createObjectURL(uploadedImage)
    : existingImage;

  const isFormValid = title.trim() && overview.trim() && content.trim() && selectedTags.length > 0;
  const isSubmitDisabled = isSubmitting || !isFormValid || articleLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="lg"
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3 text-2xl font-semibold">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle>Edit Artikel</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
                            <div className="font-medium">{uploadedImage.name}</div>
                            <div>{(uploadedImage.size / 1024 / 1024).toFixed(2)} MB</div>
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
                        <label htmlFor="image-upload" className="cursor-pointer">
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

              {selectedTagTitles.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  {selectedTagTitles.map((tagTitle) => (
                    <Badge
                      key={tagTitle}
                      variant="secondary"
                      className="bg-blue-600 text-white px-3 py-1 hover:bg-blue-700"
                    >
                      {tagTitle}
                      <button
                        onClick={() => handleTagRemove(tagTitle)}
                        className="ml-2 text-blue-200 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">
                  Pilih kategori yang sesuai:
                </span>
                <div className="border rounded-lg p-3 bg-gray-50 min-h-[60px]">
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
                          variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTagToggle(tag)}
                          className={
                            selectedTags.includes(tag.id)
                              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                              : "border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
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
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                Isi Artikel
                <span className="text-red-500 text-xs">*</span>
              </Label>

              <div className="border rounded-lg shadow-sm">
                {articleLoading ? (
                  <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">
                        Memuat konten artikel...
                      </p>
                    </div>
                  </div>
                ) : (
                  <Editor
                    key={editorKey}
                    editorState={editorState}
                    editorSerializedState={serializedEditorState}
                    onChange={setEditorState}
                    onSerializedChange={(serialized) => {
                      setSerializedEditorState(serialized);
                      setContent(JSON.stringify(serialized));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t gap-3">
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
            disabled={isSubmitDisabled}
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
