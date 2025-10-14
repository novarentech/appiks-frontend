"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Gift } from "lucide-react";
import { motion } from "framer-motion";

interface ActionButtonsProps {
  canClaimReward: boolean;
  onFoodStoreClick: () => void;
  onDailyRewardClick: () => void;
}

export default function ActionButtons({
  canClaimReward,
  onFoodStoreClick,
  onDailyRewardClick,
}: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      className="h-full"
    >
      <div className="flex flex-col gap-8 h-full">
        {/* Food Store Button */}
        <motion.div
          whileHover={{ scale: 1.01, x: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className="group"
        >
          <Card
            className="bg-white text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer rounded-2xl border border-slate-200/70"
            onClick={onFoodStoreClick}
          >
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900 font-semibold text-lg">
                    Toko Makanan
                  </div>
                  <div className="text-slate-500 text-sm">
                    Beli makanan untuk awan
                  </div>
                  <div className="text-indigo-600 text-xs mt-2">
                    4 item tersedia
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Reward Button */}
        <motion.div
          whileHover={{ scale: 1.01, x: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className="group"
        >
          <Card
            className="bg-white text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer rounded-2xl border border-slate-200/70"
            onClick={onDailyRewardClick}
          >
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 relative">
                  <Gift className="w-6 h-6" />
                  {canClaimReward && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900 font-semibold text-lg">
                    Hadiah Harian
                  </div>
                  <div className="text-slate-500 text-sm">
                    Klaim tetesan embun gratis
                  </div>
                  <div className="text-emerald-600 text-xs mt-2">
                    Klaim dalam 24 jam
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
