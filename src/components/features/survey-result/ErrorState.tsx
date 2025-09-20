"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onBackToDashboard: () => void;
}

export function ErrorState({ onBackToDashboard }: ErrorStateProps) {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h2
            className="text-xl sm:text-2xl font-bold text-gray-800 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Format hasil tidak dikenali
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-6 text-sm sm:text-base"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Terjadi kesalahan dalam memproses hasil survey
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
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
      </div>
    </motion.div>
  );
}
