"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/hooks/useQuote";
import { QuoteAccessGuard } from "@/components/guards/QuoteAccessGuard";

type QuotePageProps = {
  imageSrc?: string;
  quoteType?: string;
};

export default function QuoteScreen({
  imageSrc = "/image/bg-quote.webp",
  quoteType = "secure",
}: QuotePageProps) {
  const [visible, setVisible] = useState(false);
  const [isExiting] = useState(false);
  const [isGoingToDashboard, setIsGoingToDashboard] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  // Use the quote hook to fetch data from API
  const {
    isLoading: isQuoteLoading,
    error: quoteError,
    quote,
  } = useQuote(quoteType);

  useEffect(() => {
    // Preload image and show with animation
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      setVisible(true);
    };
    img.onerror = () => {
      setVisible(true);
    };
  }, [imageSrc]);

  const handleGoToDashboard = () => {
    setIsGoingToDashboard(true);
  };

  function handleExitComplete() {
    if (isExiting) {
      router.back();
    } else if (isGoingToDashboard) {
      router.push("/dashboard");
    }
  }

  const transition = shouldReduceMotion ? { duration: 0.1 } : { duration: 0.7 };

  return (
    <QuoteAccessGuard>
      <AnimatePresence onExitComplete={handleExitComplete}>
        {visible && !isExiting && !isGoingToDashboard && (
          <motion.div
            key="quote-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            role="main"
            aria-label="Quote page"
          >
            <div className="absolute inset-0 -z-10">
              <Image
                src={imageSrc}
                alt=""
                fill
                priority
                style={{ objectFit: "cover" }}
                aria-hidden="true"
              />
            </div>

            <div className="max-w-5xl w-full px-6 text-center">
              <div className="mt-12 mx-auto max-w-3xl rounded-xl border border-white/20 bg-white/10 p-6 md:p-8 backdrop-blur-md shadow-lg">
                <h1 className="text-lg md:text-2xl font-semibold text-white">
                  Quote of the Day
                </h1>

                {/* Loading state */}
                {isQuoteLoading && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="ml-2 text-white/70">Memuat quote...</span>
                  </div>
                )}

                {/* Error state */}
                {quoteError && (
                  <div className="mt-4 text-sm text-red-200">{quoteError}</div>
                )}

                {/* Quote content */}
                {quote && !isQuoteLoading && (
                  <>
                    <p className="mt-4 text-sm md:text-base text-white/90">
                      &ldquo;{quote.text}&rdquo;
                    </p>
                    <div className="mt-4 text-sm italic text-white/80">
                      – {quote.author} –
                    </div>
                  </>
                )}

                {/* Fallback when no quote and no loading */}
                {!quote && !isQuoteLoading && !quoteError && (
                  <>
                    <p className="mt-4 text-sm md:text-base text-white/90">
                      &ldquo;Percayalah pada dirimu sendiri dan semua yang ada
                      dalam dirimu. Ketahuilah bahwa ada sesuatu di dalam dirimu
                      yang lebih besar daripada rintangan apa pun.&rdquo;
                    </p>
                    <div className="mt-4 text-sm italic text-white/80">
                      – Christian D. Larson –
                    </div>
                  </>
                )}
              </div>
              {/* Button Lanjut ke Beranda */}
              <Button
                onClick={handleGoToDashboard}
                className="rounded-full mt-5"
                size={"lg"}
              >
                <span className="text-sm font-medium">Lanjut ke Beranda</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </QuoteAccessGuard>
  );
}
