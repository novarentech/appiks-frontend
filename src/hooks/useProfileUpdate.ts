"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateProfileAPI, validateToken } from "@/lib/auth";
import type { UpdateProfileData } from "@/types/auth";

interface UseProfileUpdateReturn {
  isLoading: boolean;
  error: string | null;
  updateProfile: (profileData: {
    username: string;
    phone: string;
  }) => Promise<boolean>;
}

export function useProfileUpdate(): UseProfileUpdateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const router = useRouter();

  const updateProfile = async (profileData: {
    username: string;
    phone: string;
  }): Promise<boolean> => {
    if (!session?.user?.token) {
      setError("Session tidak ditemukan");
      return false;
    }

    console.log("🔄 Starting profile update...", {
      username: profileData.username,
      phone: profileData.phone,
      hasToken: !!session.user.token,
      tokenPrefix: session.user.token?.substring(0, 10) + "...",
    });

    // Validate token before making the request
    const tokenValidation = validateToken(session.user.token);
    console.log("🔍 Token validation:", tokenValidation);

    if (!tokenValidation.isValid) {
      setError(`Token tidak valid: ${tokenValidation.error}`);
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updateData: UpdateProfileData = {
        username: profileData.username,
        phone: profileData.phone,
        verified: true,
      };

      console.log("📤 Sending update request...", updateData);

      const response = await updateProfileAPI(updateData, session.user.token);

      if (response.success) {
        // Update session dengan data terbaru dari response API
        await update({
          ...session,
          user: {
            ...session.user,
            username: response.data.username,
            verified: response.data.verified,
            // Tambahkan data lain yang mungkin berguna
            name: response.data.name,
            phone: response.data.phone,
          },
        });

        console.log("✅ Session updated successfully:", {
          username: response.data.username,
          verified: response.data.verified,
          phone: response.data.phone,
        });

        // Redirect ke dashboard
        router.push("/dashboard");
        return true;
      } else {
        console.error("❌ Profile update failed:", response);
        setError(response.message || "Gagal memperbarui profil");
        return false;
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);

      let errorMessage = "Terjadi kesalahan yang tidak diketahui";

      if (error instanceof Error) {
        // Handle specific HTTP errors
        if (error.message.includes("403")) {
          errorMessage =
            "Akses ditolak. Token mungkin tidak valid atau sudah kedaluwarsa.";
        } else if (error.message.includes("401")) {
          errorMessage = "Sesi sudah kedaluwarsa. Silakan login kembali.";
        } else if (error.message.includes("400")) {
          errorMessage = "Data yang dikirim tidak valid.";
        } else if (error.message.includes("500")) {
          errorMessage = "Terjadi kesalahan pada server.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateProfile,
  };
}
