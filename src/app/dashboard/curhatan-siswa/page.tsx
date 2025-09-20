"use client";

import CouncelorPanel from "@/components/dashboard/panels/CouncelorPanel";
import ConfidentTable from "@/components/data-display/tables/ConfidentTable";
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

  const handleResponseSubmit = (curhatId: number, response: string) => {
    // Here you would typically make an API call to save the response
    console.log(`Response to curhat ${curhatId}:`, response);
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
        <h1 className="text-3xl font-bold">Curhatan Siswa</h1>
        <p className="text-gray-600 mt-2">Kelola dan tanggapi curhatan siswa</p>
      </div>

      {/* Panel Statistik */}
      <CounselorPanel />

      {/* Table Curhatan Siswa */}
      <ConfidentTable onResponseSubmit={handleResponseSubmit} />
    </div>
  );
}
