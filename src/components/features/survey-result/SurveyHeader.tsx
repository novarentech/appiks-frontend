"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft} from "lucide-react";

interface SurveyHeaderProps {
  title: string;
  onBackToDashboard: () => void;
}

export function SurveyHeader({
  title,
  onBackToDashboard,
}: SurveyHeaderProps) {
  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          variant="ghost"
          className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group text-sm sm:text-base"
          onClick={onBackToDashboard}
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          Ke Halaman Dashboard
        </Button>
      </motion.div>

      <motion.h1
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 text-center mt-10 sm:mt-20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {title}
      </motion.h1>
    </motion.div>
  );
}
