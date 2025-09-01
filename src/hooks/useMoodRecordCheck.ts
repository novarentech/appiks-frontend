"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { checkMoodRecordAPI } from "@/lib/auth";

interface UseMoodRecordCheckReturn {
  isLoading: boolean;
  error: string | null;
  canCheckIn: boolean | null;
  checkMoodRecord: () => Promise<boolean>;
}

export function useMoodRecordCheck(): UseMoodRecordCheckReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canCheckIn, setCanCheckIn] = useState<boolean | null>(null);
  const { data: session } = useSession();

  const checkMoodRecord = async (): Promise<boolean> => {
    if (!session?.user?.token) {
      console.log("❌ No session or token found for mood record check");
      setError("Token tidak ditemukan");
      return false;
    }

    console.log(
      "🔑 Using token for mood record check:",
      session.user.token.substring(0, 20) + "..."
    );

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Checking mood record for user...");
      const response = await checkMoodRecordAPI(session.user.token);

      console.log("📥 Mood record API response:", response);

      if (response.success) {
        setCanCheckIn(response.data.can);
        console.log("✅ Mood record check completed:", response.data.can);
        return response.data.can;
      } else {
        console.log("❌ Mood record check failed:", response.message);
        setError(response.message || "Gagal mengecek mood record");
        return false;
      }
    } catch (error) {
      console.error("❌ Mood record check error:", error);

      let errorMessage = "Terjadi kesalahan yang tidak diketahui";

      if (error instanceof Error) {
        if (error.message.includes("403")) {
          errorMessage = "Akses ditolak. Token mungkin tidak valid.";
        } else if (error.message.includes("401")) {
          errorMessage = "Sesi sudah kedaluwarsa. Silakan login kembali.";
        } else if (error.message.includes("404")) {
          errorMessage = "Endpoint tidak ditemukan.";
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
    canCheckIn,
    checkMoodRecord,
  };
}
