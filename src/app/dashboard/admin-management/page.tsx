"use client";

import TuDataTable from "@/components/data-display/tables/TuDataTable";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ClassDataPage() {
  return (
    <RoleGuard permissionType="admin-management">
      <ClassDataPageContent />
    </RoleGuard>
  );
}

function ClassDataPageContent() {

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Data Admin TU"
        subtitle="Kelola Data Admin TU dengan Mudah"
      />
      <TuDataTable />
    </div>
  );
}
