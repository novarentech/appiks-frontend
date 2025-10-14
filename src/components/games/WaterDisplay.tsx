"use client";

import { Droplets } from "lucide-react";
import { motion } from "framer-motion";

interface WaterDisplayProps {
  waterDrops: number;
}

export default function WaterDisplay({ waterDrops }: WaterDisplayProps) {
  return (
    <div className="relative z-10 pt-10 pb-6">
      <div className="flex justify-center">
        <motion.div
          className="bg-white/15 backdrop-blur-xl rounded-full px-8 py-4 flex items-center gap-4 sm:gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/30 hover:bg-white/20 transition-all duration-300"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center rounded-full">
            <Droplets className="w-6 h-6 text-white drop-shadow" />
          </div>
          <div>
            <div className="text-white/80 text-xs sm:text-sm font-medium mb-0.5">
              Total Tetesan Air
            </div>
            <motion.div
              className="text-white text-2xl font-bold drop-shadow-lg"
              key={waterDrops}
              initial={{ scale: 1.3, color: "#fbbf24" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {waterDrops}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
