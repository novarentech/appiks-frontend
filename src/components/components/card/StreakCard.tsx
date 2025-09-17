"use client";

import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface StreaksData {
  streak: number;
}

export function StreakCard() {
  const [streakData, setStreakData] = useState<StreaksData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStreakData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mood-record/streaks');
      const result = await response.json();
      if (result.success) {
        setStreakData(result.data);
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, []);

  return (
    <motion.div
      className="bg-amber-500 text-white p-4 sm:p-6 rounded-2xl shadow-xl relative overflow-hidden h-full"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
      <motion.div
        className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 text-white/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <Flame className="w-12 h-12 sm:w-20 sm:h-20" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Streak Check In
          </h3>
        </div>

        {/* Main Content Container */}
        <motion.div
          className="bg-gradient-to-r from-amber-400/80 via-yellow-400/70 to-amber-400/80 backdrop-blur-sm rounded-xl p-2 sm:p-2 border border-white/30 flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Text Content */}
          <div className="flex-1 text-center">
            <motion.div
              className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {loading ? "Memuat..." : streakData ? (
                <>{streakData?.streak} hari!</>
              ) : (
                <>0 Hari!</>
              )}
            </motion.div>
            <p className="text-xs sm:text-sm leading-relaxed px-2 sm:px-0">
              Konsistensi adalah kunci untuk memahami pola emosionalmu
            </p>
          </div>

          {/* Fire Character */}
          <motion.div
            className="flex-shrink-0 sm:ml-6 order-first sm:order-last"
            animate={{
              y: [0, -10, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="filter drop-shadow-lg"
              whileHover={{
                scale: 1.2,
                rotate: 15,
                filter: "drop-shadow(0 0 20px rgba(255,165,0,0.6))",
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/icon/ico-fire.webp"
                alt="Fire Icon"
                width={120}
                height={120}
                className="sm:w-[180px] sm:h-[180px]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
