"use client";

import { useAuth } from "@/hooks/useAuth";
import { CheckinAccessGuard } from "@/components/auth/guards/CheckinAccessGuard";
import CheckIn from "@/components/features/checkin/Checkin";

export default function CheckInPage() {
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
    <CheckinAccessGuard>
        <CheckIn />
    </CheckinAccessGuard>
  );
}
