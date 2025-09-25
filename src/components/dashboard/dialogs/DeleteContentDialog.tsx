"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { ContentItem } from "@/components/data-display/tables/ContentManagementTable";
import { toast } from "sonner";
import { deleteQuote, deleteVideo, deleteArticle } from "@/lib/api";

interface DeleteContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentItem: ContentItem | null;
  onSuccess: () => void;
}

export function DeleteContentDialog({
  open,
  onOpenChange,
  contentItem,
  onSuccess,
}: DeleteContentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!contentItem) return null;

  const handleDelete = async () => {
    if (!contentItem.ids) {
      toast.error("ID konten tidak ditemukan");
      return;
    }

    setIsDeleting(true);

    try {
      let response;
      const contentType = contentItem.type.toLowerCase();
      
      switch (contentType) {
        case "quotes":
          response = await deleteQuote(contentItem.ids);
          break;
        case "video":
          response = await deleteVideo(contentItem.ids);
          break;
        case "artikel":
          response = await deleteArticle(contentItem.ids);
          break;
        default:
          throw new Error("Jenis konten tidak valid");
      }

      if (response.success) {
        toast.success(`${contentItem.type} berhasil dihapus`);
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        onOpenChange(false);
      } else {
        throw new Error(response.message || `Gagal menghapus ${contentItem.type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${contentItem.type}:`, error);
      toast.error(`Gagal menghapus ${contentItem.type}. Silakan coba lagi.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Hapus {contentItem.type}
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            Apakah Anda yakin ingin menghapus <b>{contentItem.title}</b>? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">
              <strong>Judul:</strong> {contentItem.title}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <strong>Jenis:</strong> {contentItem.type}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-center gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 min-w-[120px]"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
