"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface GameStatsProps {
  level: number;
  happiness: number;
  experience: number;
}

export default function GameStats({
  level,
  happiness,
  experience,
}: GameStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="h-full"
    >
      <Card className="h-full bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl p-6 sm:p-8 rounded-3xl hover:bg-white/20 transition-all duration-500">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="text-white text-3xl sm:text-4xl font-bold tracking-tight drop-shadow">
            Cirrus
          </div>
          <div className="text-white/90 mt-1 text-sm">Level {level}</div>
        </div>

        {/* Stats – using shadcn Progress */}
        <div className="space-y-6">
          {/* Kebahagiaan */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-white/90 text-sm font-semibold">
                Kebahagiaan
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white font-medium border border-white/20">
                {happiness}%
              </span>
            </div>
            <Progress
              value={happiness}
              className="h-8 bg-white/15 border border-white/20"
              indicatorClassName="bg-gradient-to-r from-indigo-300 via-sky-400 to-blue-500"
            />
          </div>

          {/* Pengalaman */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-white/90 text-sm font-semibold">
                Pengalaman
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white font-medium border border-white/20">
                {experience} XP
              </span>
            </div>
            <Progress
              value={experience}
              className="h-8 bg-white/15 border border-white/20"
              indicatorClassName="bg-gradient-to-r from-sky-300 via-blue-500 to-indigo-600"
            />
            <div className="mt-2 flex items-center justify-between text-[12px]">
              <span className="text-white/80 font-medium">
                {experience}/100 XP
              </span>
              <span className="text-white/80">Level {level + 1}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
