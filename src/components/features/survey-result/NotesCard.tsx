"use client";

import { motion } from "framer-motion";

interface NotesCardProps {
  content: string;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function NotesCard({
  content,
  className = "lg:col-span-3",
}: NotesCardProps) {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-sky-300 overflow-hidden hover:shadow-xl transition-shadow duration-300 text-fuchsia-500 p-4 sm:p-6 lg:p-8 ${className}`}
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-center mb-4">
        Catatan Untuk Kamu
      </h3>
      <p className="text-xs sm:text-sm lg:text-base text-center leading-relaxed">
        {content}
      </p>
    </motion.div>
  );
}
