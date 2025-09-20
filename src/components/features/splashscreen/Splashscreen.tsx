"use client";

import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type SplashProps = {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  quote?: string;
  author?: string;
  duration?: number;
  showOnce?: boolean;
  onFinish?: () => void;
};

interface QuoteData {
  text: string;
  author: string;
}

export default function SplashScreen({
  imageSrc = "/image/bgSplashScreen.webp",
  title = "Hai, Selamat Datang di Appiks!",
  subtitle = "Platform untuk Mencegah Intoleransi dan Kekerasan di Sekolah melalui Pemantauan Emosi & Edukasi Positif.",
  quote:
    fallbackQuote = '"Percayalah pada dirimu sendiri dan semua yang ada dalam dirimu. Ketahuilah bahwa ada sesuatu di dalam dirimu yang lebih besar daripada rintangan apa pun."',
  author: fallbackAuthor = "Christian D. Larson",
  duration = 3000,
  showOnce = true,
  onFinish,
}: SplashProps) {
  const [visible, setVisible] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    text: fallbackQuote,
    author: fallbackAuthor,
  });
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Fetch quote from API
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setIsLoadingQuote(true);
        const response = await fetch("/api/quote/mood");

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setQuoteData({
              text: data.data.text || fallbackQuote,
              author: data.data.author || fallbackAuthor,
            });
          }
        } else {
          console.warn("Failed to fetch quote, using fallback");
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        // Keep fallback values
      } finally {
        setIsLoadingQuote(false);
      }
    };

    fetchQuote();
  }, [fallbackQuote, fallbackAuthor]);

  useEffect(() => {
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      setVisible(true);
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!visible || isLoadingQuote) return;

    if (showOnce) {
      try {
        if (sessionStorage.getItem("appiks_splash_seen") === "1") {
          setVisible(false);
          onFinish?.();
          return;
        }
      } catch {}
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, isLoadingQuote, duration, showOnce, onFinish]);

  function handleExitComplete() {
    if (showOnce) {
      try {
        sessionStorage.setItem("appiks_splash_seen", "1");
      } catch {}
    }
    onFinish?.();
  }

  const transition = shouldReduceMotion ? { duration: 0.1 } : { duration: 0.7 };

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={imageSrc} />
      </Head>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {visible && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            role="dialog"
            aria-label="Splash screen"
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
              <h1 className="text-4xl md:text-6xl font-semibold text-white drop-shadow-md leading-tight">
                {title}
              </h1>
              <p className="mt-4 text-sm md:text-lg text-white/90 max-w-3xl mx-auto">
                {subtitle}
              </p>

              <div className="mt-12 mx-auto max-w-3xl rounded-xl border border-slate-50 bg-white/10 p-6 md:p-8 backdrop-blur-md shadow-lg">
                <h3 className="text-lg md:text-2xl font-semibold text-white">
                  Quote of the Day
                </h3>
                {isLoadingQuote ? (
                  <div className="mt-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-4 bg-white/20 rounded w-1/2 mx-auto mb-4"></div>
                      <div className="h-3 bg-white/20 rounded w-1/3 mx-auto"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-4 text-sm md:text-base text-white/90">
                      {quoteData.text}
                    </p>
                    <div className="mt-4 text-sm italic text-white/80">
                      – {quoteData.author} –
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
