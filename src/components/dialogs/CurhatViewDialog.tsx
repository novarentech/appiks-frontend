"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Sharing } from "@/types/api";

interface CurhatViewDialogProps {
  curhat: Sharing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CurhatViewDialog({
  curhat,
  isOpen,
  onClose,
}: CurhatViewDialogProps) {
  if (!curhat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-600" />
            <DialogTitle>Lihat Balasan</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6 px-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              {curhat.title && <h4 className="font-semibold text-xl mb-3">{curhat.title}</h4>}
              <p className="text-gray-700 mb-4 leading-relaxed text-base">
                {curhat.description}
              </p>
              <div className="text-sm text-gray-500">
                Dari: {curhat.user.name} • {new Date(curhat.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {curhat.reply && (
              <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                <h5 className="font-medium text-teal-800 mb-3 text-lg">
                  Tanggapan Anda
                </h5>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                  {curhat.reply}
                </p>
                {curhat.replied_at && (
                  <div className="text-sm text-teal-600 mt-4">
                    Dibalas pada: {new Date(curhat.replied_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
