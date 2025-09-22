"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMoodRecordToday } from "@/hooks/useMoodRecordToday";
import { motion } from "framer-motion";
import Image from "next/image";

export function WelcomeCard() {
  const { user } = useAuth();
  const { data: moodRecord, loading } = useMoodRecordToday();

  // Fungsi untuk memetakan type mood ke teks
  const getMoodText = (type: string) => {
    switch (type) {
      case "angry": return "Marah";
      case "sad": return "Sedih";
      case "happy": return "Gembira";
      case "neutral": return "Netral";
      default: return "Belum ada data";
    }
  };

  // Fungsi untuk memetakan status
  const getStatusText = (status: string) => {
    switch (status) {
      case "secure": return "Aman";
      case "insecure": return "Tidak Aman";
      default: return "Belum dicek";
    }
  };

  // Fungsi untuk mendapatkan ikon mood
  const getMoodIcon = (type: string) => {
    switch (type) {
      case "angry": return "/icon/ico-angry.svg";
      case "sad": return "/icon/ico-sad.svg";
      case "happy": return "/icon/ico-happy.svg";
      case "neutral": return "/icon/ico-neutral.svg";
      default: return "/icon/ico-happy.svg";
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 text-white p-4 sm:p-6 rounded-2xl shadow-xl relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/5 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-sm leading-tight">
            Halo, {user?.name || user?.username || "Marsha Bilqis"}!
          </h2>
          <p className="text-indigo-100 text-base sm:text-lg">
            Bagaimana perasaanmu hari ini?
          </p>
        </div>

        {/* Mood Check-in Card */}
        <motion.div
          className="bg-gradient-to-r from-indigo-400/80 via-purple-400/60 to-indigo-400/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <Image
                  src={getMoodIcon(moodRecord?.type || "")}
                  alt="Mood Emoji"
                  width={32}
                  height={32}
                  className="sm:w-10 sm:h-10"
                />
              </motion.div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-lg truncate">
                  Mood Check-in Hari Ini
                </h3>
                <p className="text-indigo-100 text-xs sm:text-sm">
                  {loading ? "Memuat..." : getMoodText(moodRecord?.type || "")}
                </p>
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <p className="text-indigo-100 text-xs sm:text-sm">Status Kamu</p>
              <motion.div
                className={`px-2 sm:px-3 py-1 rounded-full ${
                  moodRecord?.status === "secure" ? "bg-green-500" :
                  moodRecord?.status === "insecure" ? "bg-red-500" : "bg-gray-500"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <p className="font-semibold text-white text-xs sm:text-sm">
                  {loading ? "..." : getStatusText(moodRecord?.status || "")}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
