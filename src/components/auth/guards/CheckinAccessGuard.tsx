"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CheckinAccessGuardProps {
  children: React.ReactNode;
}

export function CheckinAccessGuard({ children }: CheckinAccessGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkCheckinAccess = async () => {
      if (status === "loading") return;

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const { user } = session;

      // Only students can access checkin
      if (user.role !== "student") {
        console.log("🚫 Client-side: Non-student trying to access checkin");
        router.replace("/dashboard");
        return;
      }

      // Check if student is verified
      if (!user.verified) {
        console.log(
          "🚫 Client-side: Unverified student trying to access checkin"
        );
        router.replace("/fill-data");
        return;
      }

      // Check if student can check-in
      if (user.token) {
        console.log("🎓 Client-side: Checking student checkin access");

        try {
          // ✅ Use internal API route instead of direct backend call
          const response = await fetch("/api/mood-record/check", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("📊 Client-side: Mood check result for checkin:", data);

            if (!data.success || data.data?.can !== true) {
              console.log(
                "🚫 Client-side: Student cannot check-in, redirecting to dashboard"
              );
              router.replace("/dashboard");
              return;
            }
          } else {
            console.log(
              "🚫 Client-side: Mood API error, redirecting to dashboard"
            );
            router.replace("/dashboard");
            return;
          }
        } catch (error) {
          console.error("❌ Client-side: Error checking mood record:", error);
          router.replace("/dashboard");
          return;
        }
      }

      setIsChecking(false);
      setShouldRender(true);
    };

    checkCheckinAccess();
  }, [session, status, router]);

  // Show loading while checking
  if (isChecking || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only render children if access is allowed
  return shouldRender ? <>{children}</> : null;
}
