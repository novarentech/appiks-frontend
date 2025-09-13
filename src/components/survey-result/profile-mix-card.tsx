"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProfileMixCardProps {
  secondaryType: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProfileMixCard({ secondaryType }: ProfileMixCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-purple-600 overflow-hidden hover:shadow-xl transition-shadow duration-300 lg:col-span-3"
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 sm:p-4 lg:p-6">
        <h3 className="text-white text-base sm:text-lg lg:text-xl font-bold text-center">
          Profil Campuran Terdeteksi!
        </h3>
      </div>
      <div className="p-3 sm:p-4 lg:p-6 space-y-3 text-center">
        <Image
          src="/icon/ico-walk-3.webp"
          alt="Mix Profile"
          width={100}
          height={100}
          className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 mx-auto"
        />
        <p className="text-sm sm:text-base">
          Kamu juga menunjukkan sifat-sifat kuat:
        </p>
        <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs sm:text-sm lg:text-base font-bold">
          {secondaryType}
        </Badge>
        <p className="text-sm sm:text-base">
          Ini berarti Kamu memiliki banyak kekuatan - kombinasi yang hebat!
        </p>
      </div>
    </motion.div>
  );
}
