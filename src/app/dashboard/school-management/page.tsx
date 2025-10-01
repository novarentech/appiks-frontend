"use client";

import SuperSchoolDataTable from "@/components/data-display/tables/SuperSchoolDataTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ClassDataPage() {
  return (
    <RoleGuard permissionType="school-management">
      <ClassDataPageContent />
    </RoleGuard>
  );
}

function ClassDataPageContent() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kelola Sekolah"
        subtitle="Kelola Data Sekolah"
      />
      {/* Table Data Sekolah */}
      <SuperSchoolDataTable />
    </div>
  );
}
