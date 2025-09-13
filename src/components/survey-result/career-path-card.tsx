"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface CareerPathCardProps {
  careers: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CareerPathCard({ careers }: CareerPathCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-cyan-500 overflow-hidden hover:shadow-xl transition-shadow duration-300 lg:col-span-2"
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="bg-cyan-500 p-3 sm:p-4 lg:p-6">
        <h3 className="text-white text-sm sm:text-lg lg:text-xl font-bold text-center">
          Potensi Jalur Karier:
        </h3>
      </div>
      <div className="p-3 sm:p-4 lg:p-6 space-y-3 text-center">
        <div className="flex flex-wrap gap-2 justify-center">
          {careers.split(", ").map((career, index) => (
            <Badge
              key={index}
              className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs sm:text-sm hover:bg-cyan-200 transition-colors cursor-default"
            >
              {career.trim()}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
