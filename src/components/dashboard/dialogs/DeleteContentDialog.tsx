"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ContentItem } from "@/components/data-display/tables/ContentManagementTable";

interface DeleteContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentItem: ContentItem | null;
  onConfirm: () => void;
}

export function DeleteContentDialog({
  open,
  onOpenChange,
  contentItem,
  onConfirm,
}: DeleteContentDialogProps) {
  if (!contentItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trash2 className="h-6 w-6 text-red-600" />
            Hapus Konten
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-center text-gray-700 mb-4">
            Apakah Anda yakin ingin menghapus konten ini?
          </p>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">
              <strong>Judul:</strong> {contentItem.title}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <strong>Jenis:</strong> {contentItem.type}
            </div>
          </div>

          <p className="text-center text-red-600 text-sm mt-4">
            Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
          </p>
        </div>

        <DialogFooter className="pt-4 border-t gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
