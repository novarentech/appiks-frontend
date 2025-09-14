"use client";

import ContentManagementPanel from "@/components/components/panel/contentManagementPanel";
import { ContentManagementTable } from "@/components/dashboard/content-management-table";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContentManagementPage() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && !["admin"].includes(user.role)) {
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
    !["admin"].includes(user.role)
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
        <h1 className="text-3xl font-bold">Kelola Konten Edukasi</h1>
        <p className="text-gray-600 mt-2">Management artikel dan video </p>
      </div>

      <ContentManagementPanel />

      <ContentManagementTable />
    </div>
  );
}
