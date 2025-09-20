"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Confetti, type ConfettiRef } from "@/components/utils/magicui/Confetti";
import {
  SurveyResultData,
  isSecureResult,
  isInsecureResult,
} from "@/types/survey";
import { useAuth } from "@/hooks/useAuth";
import { BackButton, EmptyState, ErrorState, InsecureResultCard, LoadingState, SecureResultCard, SurveyHeader } from "@/components/features/survey-result";

export default function SurveyResultPage() {
  const router = useRouter();
  const [resultData, setResultData] = useState<SurveyResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const confettiRef = useRef<ConfettiRef>(null);
  const { user } = useAuth();

  // Optimized confetti function
  const fireSideCannons = useCallback(() => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confettiRef.current?.fire({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confettiRef.current?.fire({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  const handleBackToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("surveyResult");
    if (storedResult) {
      try {
        const data = JSON.parse(storedResult);
        setResultData(data);
        setTimeout(() => fireSideCannons(), 1000);
      } catch (error) {
        console.error("Error parsing survey result:", error);
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
    setIsLoading(false);
  }, [router, fireSideCannons]);

  const getUserName = () => {
    return user?.name || user?.username || "Username";
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!resultData) {
    return <EmptyState onBackToDashboard={handleBackToDashboard} />;
  }

  // Render for Secure Survey Result
  if (isSecureResult(resultData)) {
    return (
      <motion.div
        className="min-h-screen py-4 sm:py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Confetti
          ref={confettiRef}
          className="fixed left-0 top-0 w-full h-full pointer-events-none z-50"
          manualstart={true}
        />

        <SurveyHeader
          title="LAPORAN NAVIGATOR"
          onBackToDashboard={handleBackToDashboard}
        />

        <SecureResultCard resultData={resultData} userName={getUserName()} />

        <BackButton onClick={handleBackToDashboard} />
      </motion.div>
    );
  }

  // Render for Insecure Survey Result
  if (isInsecureResult(resultData)) {
    return (
      <motion.div
        className="min-h-screen py-4 sm:py-8 px-4 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Confetti
          ref={confettiRef}
          className="fixed left-0 top-0 w-full h-full pointer-events-none z-50"
          manualstart={true}
        />

        <SurveyHeader
          title="LAPORAN PAHLAWAN"
          onBackToDashboard={handleBackToDashboard}
        />

        <InsecureResultCard resultData={resultData} userName={getUserName()} />

        <BackButton onClick={handleBackToDashboard} />
      </motion.div>
    );
  }

  // Fallback render
  return <ErrorState onBackToDashboard={handleBackToDashboard} />;
}
