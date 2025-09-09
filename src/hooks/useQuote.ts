"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { QuoteResponse, Quote } from "@/types/api";

interface UseQuoteReturn {
  isLoading: boolean;
  error: string | null;
  quote: Quote | null;
  refetch: () => Promise<void>;
}

export function useQuote(type: string = "secure"): UseQuoteReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const { data: session } = useSession();

  const fetchQuote = async () => {
    if (!session?.user?.token) {
      setError("Token tidak ditemukan");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Fetching quote with type:", type);

      // ✅ Use internal API route
      const response = await fetch(`/api/quote/type/${type}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil quote");
      }

      const data: QuoteResponse = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // Get random quote from the array
        const randomIndex = Math.floor(Math.random() * data.data.length);
        setQuote(data.data[randomIndex]);
        console.log("✅ Quote loaded:", data.data[randomIndex]);
      } else {
        setError(data.message || "Tidak ada quote tersedia");
      }
    } catch (error) {
      console.error("❌ Quote fetch error:", error);

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
      fetchQuote();
    } else if (session === null) {
      // No session available
      setIsLoading(false);
      setError("Sesi tidak ditemukan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.token, type]);

  return {
    isLoading,
    error,
    quote,
    refetch: fetchQuote,
  };
}
