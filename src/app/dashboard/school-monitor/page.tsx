"use client";

import SchoolMonitorTable from "@/components/data-display/tables/SchoolMonitorTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function SchoolMonitorPage() {
  return (
    <RoleGuard permissionType="school-monitor">
      <SchoolMonitorPageContent />
    </RoleGuard>
  );
}

function SchoolMonitorPageContent() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Monitoring Sekolah"
        subtitle="Sistem pelacakan data sekolah, kelas, dan siswa"
      />
      
      {/* Table Data Sekolah */}
      <SchoolMonitorTable />
    </div>
  );
}
