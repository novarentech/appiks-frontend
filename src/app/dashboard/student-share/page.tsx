"use client";

import ConfidentPanel from "@/components/dashboard/panels/ConfidentPanel";
import ConfidentTable from "@/components/data-display/tables/ConfidentTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardDataSiswaPage() {
  return (
    <RoleGuard permissionType="student-share">
      <DashboardDataSiswaPageContent />
    </RoleGuard>
  );
}

function DashboardDataSiswaPageContent() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Curhatan Siswa"
        subtitle="Kelola dan tanggapi curhatan siswa"
      />

      {/* Panel Statistik */}
      <ConfidentPanel />

      {/* Table Curhatan Siswa */}
      <ConfidentTable />
    </div>
  );
}
