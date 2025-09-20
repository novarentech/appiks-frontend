"use client";

import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const tips = [
  {
    text: "Tidur 7-8 jam semalam terbukti dapat meningkatkan stabilitas emosi.",
  },
  {
    text: "Luangkan waktu 10 menit untuk meditasi setiap hari untuk mengurangi stress.",
  },
  {
    text: "Minum air putih minimal 8 gelas sehari untuk menjaga mood tetap stabil.",
  },
  {
    text: "Olahraga ringan 30 menit sehari dapat melepaskan hormon endorfin.",
  },
  {
    text: "Tuliskan 3 hal yang kamu syukuri setiap hari untuk meningkatkan kebahagiaan.",
  },
];

export function TipsCard() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshTip = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      setIsRefreshing(false);
    }, 300);
  };

  const currentTip = tips[currentTipIndex];

  return (
    <motion.div
      className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white p-4 sm:p-6 rounded-2xl shadow-xl relative overflow-hidden h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>

      {/* Decorative circles */}
      <div className="absolute -bottom-25 -left-25 w-50 h-50 bg-white/30 rounded-full"></div>
      <div className="absolute -bottom-50 -left-50 w-100 h-100 bg-white/35 rounded-full"></div>
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/15 rounded-full"></div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Tips Hari Ini
          </h3>
          <motion.button
            onClick={refreshTip}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 text-white transition-transform ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </motion.button>
        </div>

        {/* Main content with lamp character */}
        <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
          {/* Lamp Character */}
          <motion.div
            className="flex-shrink-0 order-1 sm:order-none"
            animate={{
              y: [0, -8, 0],
              rotate: [-3, 3, -3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.1,
                filter: "drop-shadow(0 0 15px rgba(255,255,255,0.3))",
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/icon/ico-lamp.webp"
                alt="Lamp Character"
                width={120}
                height={120}
                className="drop-shadow-lg w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
              />
            </motion.div>
          </motion.div>

          {/* Tip Content */}
          <motion.div
            className="flex-1 text-center sm:text-left"
            key={currentTipIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
              {currentTip.text}
            </p>
          </motion.div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
          {tips.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTipIndex ? "bg-white" : "bg-white/40"
              }`}
              onClick={() => setCurrentTipIndex(index)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
