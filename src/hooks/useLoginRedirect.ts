"use client";

import { useState } from "react";

interface RedirectResponse {
  redirect: string;
  reason?: string;
}

interface UseLoginRedirectReturn {
  isLoading: boolean;
  error: string | null;
  getRedirectUrl: () => Promise<string>;
}

export function useLoginRedirect(): UseLoginRedirectReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRedirectUrl = async (): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔀 Calling redirect API...");

      const response = await fetch("/api/auth/redirect", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Redirect API error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        // Fallback to dashboard on API error
        return "/dashboard";
      }

      const data: RedirectResponse = await response.json();
      console.log("📍 Redirect API response:", data);

      return data.redirect || "/dashboard";
    } catch (error) {
      console.error("❌ Error calling redirect API:", error);
      setError("Terjadi kesalahan saat menentukan redirect");
      // Fallback to dashboard on error
      return "/dashboard";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getRedirectUrl,
  };
}
