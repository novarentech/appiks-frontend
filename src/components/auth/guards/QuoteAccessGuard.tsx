"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QuoteAccessGuardProps {
  children: React.ReactNode;
}

export function QuoteAccessGuard({ children }: QuoteAccessGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  // Cleanup session storage when component unmounts
  useEffect(() => {
    return () => {
      try {
        sessionStorage.removeItem("quote_access_from_checkin");
        console.log("🧹 Quote access flag cleaned up");
      } catch (error) {
        console.error("❌ Failed to cleanup quote access flag:", error);
      }
    };
  }, []);

  useEffect(() => {
    const checkQuoteAccess = async () => {
      if (status === "loading") return;

      // Check if user is not logged in
      if (!session?.user) {
        console.log("🚫 Quote access: No session, redirecting to login");
        router.replace("/login");
        return;
      }

      const { user } = session;

      // Check if user is not a student
      if (user.role !== "student") {
        console.log("🚫 Quote access: Non-student trying to access quote page");
        router.replace("/dashboard");
        return;
      }

      // Check if student is not verified
      if (!user.verified) {
        console.log(
          "🚫 Quote access: Unverified student trying to access quote page"
        );
        router.replace("/fill-data");
        return;
      }

      // Check if the user came from checkin page by checking referrer or session storage
      const referrer = document.referrer;
      const sessionStorageFlag = sessionStorage.getItem(
        "quote_access_from_checkin"
      );
      const isFromCheckin =
        referrer.includes("/checkin") || sessionStorageFlag === "true";

      console.log("🔍 Quote access debug:", {
        referrer,
        sessionStorageFlag,
        isFromCheckin,
      });

      // Temporary bypass for debugging - remove this after testing
      console.log("🟡 Development mode: Allowing quote access for debugging");
      setIsChecking(false);
      setShouldRender(true);
      return;

      if (!isFromCheckin) {
        console.log("🚫 Quote access: Student not coming from checkin page");
        router.replace("/dashboard");
        return;
      }

      console.log("✅ Quote access: Student from checkin allowed");
      setIsChecking(false);
      setShouldRender(true);
    };

    checkQuoteAccess();
  }, [session, status, router]);

  // Show loading while checking
  if (isChecking || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Only render children if access is allowed
  return shouldRender ? <>{children}</> : null;
}
