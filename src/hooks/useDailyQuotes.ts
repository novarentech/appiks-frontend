"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Quote } from "@/types/api";

interface UseDailyQuotesReturn {
  isLoading: boolean;
  error: string | null;
  quotes: Quote[];
  refetch: () => Promise<void>;
}

export function useDailyQuotes(): UseDailyQuotesReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const { data: session } = useSession();

  const fetchQuotes = async () => {
    if (!session?.user?.token) {
      setError("Token tidak ditemukan");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Fetching daily quotes from API");

      const response = await fetch("/api/quote/daily", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil quote");
      }

      const data = await response.json();
      console.log("📋 Daily quotes API Response:", data);

      if (data.success && data.data) {
        if (Array.isArray(data.data)) {
          setQuotes(data.data);
          console.log("✅ Daily quotes loaded:", data.data);
        } else {
          // If single object, wrap in array
          setQuotes([data.data]);
          console.log("✅ Daily quote loaded (single):", data.data);
        }
      } else {
        setError(data.message || "Tidak ada quote tersedia");
      }
    } catch (error) {
      console.error("❌ Daily quotes fetch error:", error);

      let errorMessage = "Terjadi kesalahan yang tidak diketahui";

      if (error instanceof Error) {
        if (error.message.includes("403")) {
          errorMessage = "Akses ditolak. Token mungkin tidak valid.";
        } else if (error.message.includes("401")) {
          errorMessage = "Sesi sudah kedaluwarsa. Silakan login kembali.";
        } else if (error.message.includes("404")) {
          errorMessage = "Quote tidak ditemukan.";
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
      fetchQuotes();
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
    quotes,
    refetch: fetchQuotes,
  };
}
