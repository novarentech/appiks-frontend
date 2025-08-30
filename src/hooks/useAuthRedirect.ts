"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect(redirectTo: string = "/dashboard") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      // Check if user is verified before redirecting
      if (session.user.verified) {
        router.push(redirectTo);
      } else {
        // If not verified, redirect to fill-data page
        router.push("/fill-data");
      }
    }
  }, [session, status, redirectTo, router]);

  return {
    isAuthenticated: status === "authenticated",
    isVerified: session?.user?.verified || false,
    isLoading: status === "loading",
  };
}
