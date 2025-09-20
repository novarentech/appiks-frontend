"use client";

import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          className="rounded-full h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-blue-200 border-t-blue-600 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="mt-6 text-gray-700 font-medium text-sm sm:text-base"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Memproses hasil analisismu...
        </motion.p>
      </div>
    </motion.div>
  );
}
