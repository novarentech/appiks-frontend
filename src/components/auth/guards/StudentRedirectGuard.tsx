"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentRedirectGuardProps {
  children: React.ReactNode;
}

export function StudentRedirectGuard({ children }: StudentRedirectGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkStudentAccess = async () => {
      if (status === "loading") return;

      if (!session?.user) {
        setIsChecking(false);
        setShouldRender(true);
        return;
      }

      const { user } = session;

      // Only check for verified students
      if (user.role === "student" && user.verified && user.token) {
        console.log("🎓 Client-side: Checking student access to dashboard");

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
            console.log("📊 Client-side: Mood check result:", data);

            if (data.success && data.data?.can === true) {
              console.log(
                "🚫 Client-side: Student can check-in, redirecting to /checkin"
              );
              router.replace("/checkin");
              return;
            }
          }
        } catch (error) {
          console.error("❌ Client-side: Error checking mood record:", error);
        }
      }

      setIsChecking(false);
      setShouldRender(true);
    };

    checkStudentAccess();
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
