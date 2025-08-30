"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserProfileAPI } from "@/lib/auth";
import type { UserProfileResponse } from "@/types/auth";

interface UseUserProfileReturn {
  isLoading: boolean;
  error: string | null;
  profileData: UserProfileResponse["data"] | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<
    UserProfileResponse["data"] | null
  >(null);
  const { data: session } = useSession();

  const fetchProfile = async () => {
    if (!session?.user?.token) {
      setError("Token tidak ditemukan");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Fetching user profile...");
      const response = await getUserProfileAPI(session.user.token);

      if (response.success) {
        setProfileData(response.data);
        console.log("✅ Profile data loaded:", response.data);
      } else {
        setError(response.message || "Gagal mengambil data profil");
      }
    } catch (error) {
      console.error("❌ Profile fetch error:", error);

      let errorMessage = "Terjadi kesalahan yang tidak diketahui";

      if (error instanceof Error) {
        if (error.message.includes("403")) {
          errorMessage = "Akses ditolak. Token mungkin tidak valid.";
        } else if (error.message.includes("401")) {
          errorMessage = "Sesi sudah kedaluwarsa. Silakan login kembali.";
        } else if (error.message.includes("404")) {
          errorMessage = "Data profil tidak ditemukan.";
        } else if (error.message.includes("500")) {
          errorMessage = "Terjadi kesalahan pada server.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      fetchProfile();
    } else if (session === null) {
      // No session available
      setIsLoading(false);
      setError("Sesi tidak ditemukan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.token]);

  return {
    isLoading,
    error,
    profileData,
    refetch: fetchProfile,
  };
}
