"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(requireAuth: boolean = true) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === "unauthenticated") {
      router.push("/login");
    } else if (
      requireAuth &&
      status === "authenticated" &&
      session?.user &&
      !session.user.verified
    ) {
      // Redirect unverified users to fill-data page
      router.push("/fill-data");
    }
  }, [status, requireAuth, router, session]);

  return {
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isVerified: session?.user?.verified || false,
    user: session?.user,
  };
}

export function useAuthData() {
  const { session } = useAuth(false);

  return {
    username: session?.user?.username || "",
    verified: session?.user?.verified || false,
    token: session?.user?.token || "",
    expiresIn: session?.user?.expiresIn || "",
    userId: session?.user?.id || "",
  };
}
