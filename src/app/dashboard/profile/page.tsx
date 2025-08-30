"use client";

import { ProfilePage } from "@/components/components/profile/profileCard";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePageComponent() {
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
    <>
      <div className="text-center mb-18">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
          Profil Saya
        </h1>
        <p className="text-muted-foreground">Kelola informasi pribadi mu</p>
      </div>
      <ProfilePage />
    </>
  );
}
