"use client";

import { Survey } from "@/components/features/survey/Survey";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SurveyPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && !["student"].includes(user.role)) {
      router.push("/dashboard");
      return;
    }

    // You can determine survey type based on user's checkin status
    // For now, defaulting to 'secure'
    // const type = user?.checkinStatus === 'secure' ? 'secure' : 'insecure';
    // setSurveyType(type);
  }, [isLoading, isAuthenticated, isVerified, user, router]);

  // Auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return <Survey />;
}