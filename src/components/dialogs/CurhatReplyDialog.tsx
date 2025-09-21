"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, X, Send } from "lucide-react";
import { useState } from "react";

// Types
interface Curhat {
  id: number;
  siswa: {
    nama: string;
    nisn: string;
    kelas: string;
  };
  judul: string;
  deskripsi: string;
  status: "terkirim" | "dibalas";
  prioritas: "rendah" | "sedang" | "tinggi";
  waktuDibuat: string;
  balasan?: string;
  waktuDibalas?: string;
}

interface CurhatReplyDialogProps {
  curhat: Curhat | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (curhatId: number, response: string) => void;
}

export default function CurhatReplyDialog({
  curhat,
  isOpen,
  onClose,
  onSubmit,
}: CurhatReplyDialogProps) {
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    if (curhat && replyText.trim()) {
      onSubmit(curhat.id, replyText);
      setReplyText("");
      onClose();
    }
  };

  const handleClose = () => {
    setReplyText("");
    onClose();
  };

  if (!curhat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <DialogTitle>Balas Curhat</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6 px-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-xl mb-3">{curhat.judul}</h4>
              <p className="text-gray-700 mb-4 leading-relaxed text-base">
                {curhat.deskripsi}
              </p>
              <div className="text-sm text-gray-500">
                Dari: {curhat.siswa.nama} • {curhat.waktuDibuat}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-700">
                Tanggapan Anda
              </label>
              <textarea
                value={replyText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setReplyText(e.target.value)
                }
                placeholder="Tulis Tanggapan yang Bijaksana dan Membantu"
                className="flex min-h-[160px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Kirim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
