"use client";

import TuPanel from "@/components/dashboard/panels/TuPanel";
import SchoolMonitorTable from "@/components/data-display/tables/SchoolMonitorTable";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClassDataPage() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && !["super"].includes(user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, isAuthenticated, isVerified, user, router]);

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
    !["super"].includes(user.role)
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
        <h1 className="text-3xl font-bold">Data Admin TU</h1>
        <p className="text-gray-600 mt-2">Kelola Data Admin TU</p>
      </div>
      <TuPanel />

      <SchoolMonitorTable />
    </div>
  );
}
