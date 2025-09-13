"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onBackToDashboard: () => void;
}

export function EmptyState({ onBackToDashboard }: EmptyStateProps) {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md mx-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.p
          className="text-gray-600 text-base sm:text-lg mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Tidak ada hasil survey ditemukan
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onBackToDashboard}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Kembali ke Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
