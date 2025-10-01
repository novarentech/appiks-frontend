"use client";

import HeadTeacherPanel from "@/components/dashboard/panels/HeadTeacherPanel";
import SchoolDataTable from "@/components/data-display/tables/SchoolDataTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function SchoolDataPage() {
  return (
    <RoleGuard permissionType="school-data">
      <SchoolDataPageContent />
    </RoleGuard>
  );
}

function SchoolDataPageContent() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Data Sekolah"
        subtitle="Lihat data akun pengguna Apppiks"
      />

      {/* Panel Statistik */}
      <HeadTeacherPanel />
      <SchoolDataTable />
    </div>
  );
}
