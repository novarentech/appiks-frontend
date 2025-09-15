"use client";

import { SurveyWalkthrough } from "@/components/components/survey/SurveyWalkthrough";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SurveyWalkthroughPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const [surveyType, setSurveyType] = useState<"secure" | "insecure">("secure");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && !["student"].includes(user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, isAuthenticated, isVerified, user, router]);

  // Get survey type from sessionStorage based on isSafe value
  useEffect(() => {
    try {
      const isSafeStr = sessionStorage.getItem("mood_is_safe");
      if (isSafeStr !== null) {
        const isSafe = JSON.parse(isSafeStr);
        setSurveyType(isSafe ? "secure" : "insecure");
      }
    } catch (error) {
      console.error("Failed to parse isSafe from sessionStorage:", error);
      // Default to secure if parsing fails
      setSurveyType("secure");
    }
  }, []);

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

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-8 ">
        <Button
          variant="ghost"
          className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group"
          onClick={handleGoToDashboard}
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          Ke Halaman Dashboard
        </Button>
      </div>
      <div className="max-w-2xl lg:max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {surveyType === "secure" ? "Navigator Masa Depan" : "Ekspedisi Menemu Jati Diri"}
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            {surveyType === "secure"
              ? "Respons mu menunjukkan eksplorasi karier yang sehat dan perencanaan masa depan yang positif."
              : "Respons mu menunjukkan eksplorasi karier yang sehat dan perencanaan masa depan yang positif."}
          </p>
        </div>
      </div>
      <div>
        <SurveyWalkthrough />
      </div>
    </div>
  );
}
