"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "./user-table";
import {
  Calendar,
  Phone,
  IdCard,
  School,
  User as UserIcon,
  UserCheck,
} from "lucide-react";

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function ViewUserDialog({
  open,
  onOpenChange,
  user,
}: ViewUserDialogProps) {
  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "siswa":
        return "bg-blue-100 text-blue-700";
      case "guru_wali":
        return "bg-green-100 text-green-700";
      case "guru_bk":
        return "bg-purple-100 text-purple-700";
      case "kepala_sekolah":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "siswa":
        return "Siswa";
      case "guru_wali":
        return "Guru Wali";
      case "guru_bk":
        return "Guru BK";
      case "kepala_sekolah":
        return "Kepala Sekolah";
      default:
        return role;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            <span>Detail Pengguna</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <Avatar className="h-20 w-20 mx-auto sm:mx-0 border-2 border-blue-200">
              <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-700">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-xl text-gray-800">
                {user.fullName}
              </h3>
              <p className="text-gray-600 font-medium">{user.username}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge
                  variant="secondary"
                  className={`${getRoleBadgeColor(user.role)} font-medium`}
                >
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 border-b pb-2">
              Informasi Detail
            </h4>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    Nomor Telepon
                  </p>
                  <p className="font-semibold text-gray-900 break-all">
                    {user.phone}
                  </p>
                </div>
              </div>

              {user.nip && (
                <div className="flex items-start space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <IdCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                      NIP/NUPTK
                    </p>
                    <p className="font-semibold text-gray-900 break-all">
                      {user.nip}
                    </p>
                  </div>
                </div>
              )}

              {user.room && (
                <>
                  {user.role === "siswa" && (
                    <div className="flex items-start space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <School className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">
                          Tingkat Kelas
                        </p>
                        <p className="font-semibold text-gray-900">{user.room.level}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <School className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500">
                        {user.role === "siswa" ? "Kelas" : "Wali Kelas"}
                      </p>
                      <p className="font-semibold text-gray-900">{user.room.name}</p>
                    </div>
                  </div>
                </>
              )}

              {user.mentor && (
                <div className="flex items-start space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <UserCheck className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                      {user.role === "siswa" ? "Guru BK" : "Mentor"}
                    </p>
                    <p className="font-semibold text-gray-900">{user.mentor}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    Tanggal Dibuat
                  </p>
                  <p className="font-semibold text-gray-900">
                    {user.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
