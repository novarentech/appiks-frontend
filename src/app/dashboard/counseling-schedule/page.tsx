"use client";

import CounselingSchedulePanel from "@/components/dashboard/panels/CouncelingSchedulePanel";
import CounselingScheduleTable from "@/components/data-display/tables/CounselingScheduleTable";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardDataSiswaPage() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && !["counselor"].includes(user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, isAuthenticated, isVerified, user, router]);

  const handleScheduleUpdate = (
    scheduleId: number,
    action: string,
    data?: Record<string, unknown>
  ) => {
    // Here you would typically make an API call to update the schedule
    console.log(`Action ${action} for schedule ${scheduleId}:`, data);
    // You can add API integration here
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !isVerified ||
    !user ||
    !["counselor"].includes(user.role)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jadwal Konseling</h1>
        <p className="text-gray-600 mt-2">
          Kelola dan atur jadwal konseling siswa
        </p>
      </div>

      {/* Panel Statistik */}
      <CounselingSchedulePanel />

      {/* Table Jadwal Konseling */}
      <CounselingScheduleTable onScheduleUpdate={handleScheduleUpdate} />
    </div>
  );
}
