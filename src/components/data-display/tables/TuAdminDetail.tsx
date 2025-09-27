"use client";

import React from "react";
import {
  Eye,
  Mail,
  Phone,
  Building,
  User,
  IdCard,
  Calendar,
} from "lucide-react";
import { TuAdmin } from "./TuDataTable";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TuAdminDetailProps {
  admin: TuAdmin;
}

export default function TuAdminDetail({ admin }: TuAdminDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="flex items-center gap-3">
          <Eye className="h-6 w-6 text-[#6C63FF]" />
          <span className="text-xl font-semibold">Detail Admin TU</span>
        </DialogTitle>
      </DialogHeader>

      {/* Profile Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[#6C63FF] rounded-full flex items-center justify-center text-white text-xl font-bold">
            {admin.nama?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {admin.nama || "-"}
            </h3>
            <p className="text-sm text-gray-500">@{admin.username || "-"}</p>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2">
            Informasi Pribadi
          </h4>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
              <p className="text-gray-900 text-sm">{admin.nama || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IdCard className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">NIP/NUPTK</p>
              <p className="text-gray-900 text-sm">{admin.nip || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900 text-sm">{admin.email || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Telepon</p>
              <p className="text-gray-900 text-sm">+62{admin.telepon || "-"}</p>
            </div>
          </div>
        </div>

        {/* School Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 border-b pb-2">
            Informasi Sekolah
          </h4>

          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Nama Sekolah</p>
              <p className="text-gray-900 text-sm">{admin.sekolah || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Waktu Dibuat</p>
              <p className="text-gray-900 text-sm">{admin.waktu || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
