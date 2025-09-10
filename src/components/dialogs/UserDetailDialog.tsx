"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

// Types
interface SchoolUser {
  id: number;
  nama: string;
  username: string;
  kontak: string;
  peran: "Siswa" | "Guru Wali" | "Guru BK" | "Admin TU";
  waktuDibuat: string;
  nisn?: string;
  nip?: string;
  kelas?: string;
  guruWali?: string;
  status?: "Aktif" | "Tidak Aktif";
}

interface UserDetailDialogProps {
  user: SchoolUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailDialog({
  user,
  isOpen,
  onClose,
}: UserDetailDialogProps) {
  if (!user) return null;

  const getDetailTitle = (peran: string) => {
    switch (peran) {
      case "Siswa":
        return "Detail Siswa";
      case "Guru Wali":
        return "Detail Guru Wali";
      case "Guru BK":
        return "Detail Guru BK";
      case "Admin TU":
        return "Detail Admin TU";
      default:
        return "Detail User";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            {getDetailTitle(user.peran)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nama Lengkap
              </label>
              <Input
                value={user.nama}
                disabled
                className="bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <Input
                value={user.username}
                disabled
                className="bg-gray-50 text-gray-700"
              />
            </div>
          </div>

          {/* Role-specific fields */}
          <div className="grid grid-cols-2 gap-4">
            {user.peran === "Siswa" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    NISN
                  </label>
                  <Input
                    value={user.nisn || ""}
                    disabled
                    className="bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nomor Telepon
                  </label>
                  <Input
                    value={user.kontak}
                    disabled
                    className="bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Kelas
                  </label>
                  <Input
                    value={user.kelas || ""}
                    disabled
                    className="bg-gray-50 text-gray-700"
                  />
                </div>
                {user.guruWali && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Guru Wali
                    </label>
                    <Input
                      value={user.guruWali}
                      disabled
                      className="bg-gray-50 text-gray-700"
                    />
                  </div>
                )}
              </>
            )}

            {(user.peran === "Guru Wali" ||
              user.peran === "Guru BK" ||
              user.peran === "Admin TU") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    NIP/NUPTK
                  </label>
                  <Input
                    value={user.nip || ""}
                    disabled
                    className="bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nomor Telepon
                  </label>
                  <Input
                    value={user.kontak}
                    disabled
                    className="bg-gray-50 text-gray-700"
                  />
                </div>
              </>
            )}
          </div>

          {/* Common fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Peran
              </label>
              <Input
                value={user.peran}
                disabled
                className="bg-gray-50 text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
