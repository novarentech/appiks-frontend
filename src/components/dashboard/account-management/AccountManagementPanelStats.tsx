"use client";

import { Card } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { UserRole } from "@/types/auth";
import { User } from "./user-table";

interface AccountManagementPanelStatsProps {
  role: UserRole;
  users: User[];
}

export function AccountManagementPanelStats({
  role,
  users,
}: AccountManagementPanelStatsProps) {
  const roleUsers = users.filter((u) => u.role === role);

  const todayCreated = roleUsers.filter((u) => {
    const today = new Date().toLocaleDateString("id-ID");
    return u.createdAt === today;
  }).length;

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "siswa":
        return "SISWA";
      case "guru_wali":
        return "GURU WALI";
      case "guru_bk":
        return "GURU BK";
      case "kepala_sekolah":
        return "KEPALA SEKOLAH";
      default:
        return "PENGGUNA";
    }
  };

  const roleLabel = getRoleLabel(role);

  return (
    <Card className="w-full shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              TOTAL {roleLabel}
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {roleUsers.length}
            </p>
          </div>
        </div>

        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              AKUN DIBUAT HARI INI
            </p>
            <p className="text-3xl font-bold text-orange-600">{todayCreated}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
