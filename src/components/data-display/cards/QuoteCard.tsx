"use client";

import { RefreshCw, Sparkle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useDailyQuotes } from "@/hooks/useDailyQuotes";

// Fallback quotes in case API fails
const fallbackQuotes = [
  {
    text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    author: "Steve Jobs",
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Anonymous",
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Anonymous",
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Anonymous",
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Anonymous",
  },
];

export function QuoteCard() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { quotes, isLoading, refetch } = useDailyQuotes();

  // Use API quotes if available, otherwise fallback
  const availableQuotes = quotes.length > 0 ? quotes : fallbackQuotes;

  const refreshQuote = () => {
    if (quotes.length > 0) {
      // If we have API quotes, try to refetch new data
      setIsRefreshing(true);
      refetch().finally(() => {
        setTimeout(() => {
          setCurrentQuoteIndex((prev) => (prev + 1) % availableQuotes.length);
          setIsRefreshing(false);
        }, 300);
      });
    } else {
      // If using fallback quotes, just cycle through them
      setIsRefreshing(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % availableQuotes.length);
        setIsRefreshing(false);
      }, 300);
    }
  };

  const currentQuote = availableQuotes[currentQuoteIndex];

  // Show loading state
  if (isLoading && quotes.length === 0) {
    return (
      <motion.div
        className="bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 text-white p-4 sm:p-6 rounded-2xl shadow-xl relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-2 text-white/70">Memuat quote...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 text-white p-4 sm:p-6 rounded-2xl shadow-xl relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>

      {/* Floating sparkles */}
      {/* Multiple floating sparkles with different animations */}
      <motion.div
        className="absolute top-2 left-2 sm:top-4 sm:left-4"
        animate={{
          rotate: 360,
          opacity: [1, 0.5, 1],
          scale: [1, 1.2, 1],
          y: [0, -8, 0],
        }}
        transition={{
          rotate: { duration: 12, repeat: Infinity, ease: "linear" },
          opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Sparkle className="w-4 h-4 sm:w-6 sm:h-6 fill-white stroke-0" />
      </motion.div>

      <motion.div
        className="absolute top-4 right-4 sm:top-8 sm:right-8"
        animate={{
          rotate: -360,
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.1, 0.8],
          x: [0, 10, 0],
        }}
        transition={{
          rotate: { duration: 18, repeat: Infinity, ease: "linear" },
          opacity: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          },
          scale: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          },
          x: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
      >
        <Sparkle className="w-3 h-3 sm:w-4 sm:h-4 fill-white/70 stroke-0" />
      </motion.div>

      <motion.div
        className="absolute bottom-3 left-1/4 sm:bottom-5"
        animate={{
          rotate: 360,
          opacity: [0.4, 1, 0.4],
          scale: [0.9, 1.3, 0.9],
          y: [0, -12, 0],
          x: [0, -6, 0],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          opacity: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
          x: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 },
        }}
      >
        <Sparkle className="w-4 h-4 sm:w-5 sm:h-5 fill-white/60 stroke-0" />
      </motion.div>

      <motion.div
        className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-white"
        animate={{
          rotate: -360,
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.1, 0.8],
          x: [0, 10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <Sparkle className="w-6 h-6 sm:w-8 sm:h-8 fill-white stroke-0" />
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Left side - Star Character */}
        <div className="flex-shrink-0 order-first sm:order-none">
          <motion.div
            className="relative"
            animate={{
              y: [0, -5, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/icon/ico-quotes.svg"
              alt="Star Character"
              width={100}
              height={100}
              className="sm:w-[140px] sm:h-[140px] rotate-20"
            />
          </motion.div>
        </div>

        {/* Right side - Quote Content */}
        <div className="flex-1 relative z-10 text-center sm:text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h3 className="text-base sm:text-lg font-semibold">
                Quote of the Day
              </h3>
            </div>
            <motion.button
              onClick={refreshQuote}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 self-center sm:self-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 transition-transform ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </motion.button>
          </div>

          {/* Quote content */}
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[80px] sm:min-h-[100px] flex flex-col justify-between"
          >
            <blockquote className="mb-2 sm:mb-3">
              <p className="text-purple-100 italic leading-relaxed text-sm sm:text-base lg:text-base line-clamp-4">
                &ldquo;{currentQuote.text}&rdquo;
              </p>
            </blockquote>

            <cite className="text-purple-200 text-xs sm:text-sm font-medium">
              — {currentQuote.author}
            </cite>
          </motion.div>

          {/* Quote indicator dots */}
          <div className="flex justify-center space-x-2 mt-3 sm:mt-4">
            {availableQuotes.map((_, index: number) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentQuoteIndex ? "bg-white" : "bg-white/30"
                }`}
                onClick={() => setCurrentQuoteIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
