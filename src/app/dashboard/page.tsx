"use client";

import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/components/auth/UserProfile";

export default function DashboardPage() {
  const { isLoading, isAuthenticated, isVerified } = useAuth();

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

  if (!isAuthenticated || !isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
      </div>

      <div className="flex justify-center">
        <UserProfile />
      </div>
    </div>
  );
}
