"use client";

import ClassPanel from "@/components/dashboard/panels/ClassPanel";
import ClassDataTable from "@/components/data-display/tables/ClassDataTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ClassDataPage() {
  return (
    <RoleGuard permissionType="class-data">
      <ClassDataPageContent />
    </RoleGuard>
  );
}

function ClassDataPageContent() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Data Kelas"
        subtitle="Kelola Data Kelas"
      />
      {/* Panel Statistik */}
      <ClassPanel />
      <ClassDataTable />
    </div>
  );
}
