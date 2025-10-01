"use client";

import ContentManagementPanel from "@/components/dashboard/panels/ContentManagementPanel";
import { ContentManagementTable } from "@/components/data-display/tables/ContentManagementTable";
import { useState } from "react";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ContentManagementPage() {
  return (
    <RoleGuard permissionType="content-management">
      <ContentManagementPageContent />
    </RoleGuard>
  );
}

function ContentManagementPageContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kelola Konten Edukasi"
        subtitle="Management artikel dan video "
      />

      {/* Panel Statistik */}

      <ContentManagementPanel refreshTrigger={refreshTrigger} />

      <ContentManagementTable refreshData={refreshData} />
    </div>
  );
}
