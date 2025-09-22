"use client";

import { StudentProfile } from "@/components/features/profile/StudentProfile";
import Profile from "@/components/features/profile/Profile";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePageComponent() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();

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

  // Show different profile components based on user role
  if (user?.role === "student") {
    return <StudentProfile />;
  }

  // For non-student roles (teacher, counselor, admin, etc.)
  return <Profile />;
}
