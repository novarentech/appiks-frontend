"use client";

import CounselingSchedulePanel from "@/components/dashboard/panels/CouncelingSchedulePanel";
import CounselingScheduleTable from "@/components/data-display/tables/CounselingScheduleTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardDataSiswaPage() {
  return (
    <RoleGuard permissionType="counseling-schedule">
      <DashboardDataSiswaPageContent />
    </RoleGuard>
  );
}

function DashboardDataSiswaPageContent() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Jadwal Konseling"
        subtitle="Kelola dan atur jadwal konseling siswa"
      />

      {/* Panel Statistik */}
      <CounselingSchedulePanel />

      {/* Table Jadwal Konseling */}
      <CounselingScheduleTable />
    </div>
  );
}
