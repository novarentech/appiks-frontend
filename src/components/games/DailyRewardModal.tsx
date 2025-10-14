"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gift, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { claimWater } from "@/lib/api";
import type { ClaimRequest } from "@/types/api";

interface DailyReward {
  day: number;
  reward: number;
  claimed: boolean;
  current?: boolean;
}

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  waterDrops: number;
  canClaimReward: boolean;
  isClaiming: boolean;
  setIsClaiming: (loading: boolean) => void;
  dailyRewards: DailyReward[];
  setDailyRewards: (rewards: DailyReward[]) => void;
  onClaimSuccess: () => void;
}

export default function DailyRewardModal({
  isOpen,
  onClose,
  streak,
  waterDrops,
  canClaimReward,
  isClaiming,
  setIsClaiming,
  dailyRewards,
  setDailyRewards,
  onClaimSuccess,
}: DailyRewardModalProps) {
  const handleClaimReward = async () => {
    if (isClaiming || !canClaimReward) return;

    setIsClaiming(true);
    try {
      const claimData: ClaimRequest = {
        water: 0,
      };

      const response = await claimWater(claimData);

      if (response.success) {
        const todayReward = dailyRewards.find((r) => r.current);
        if (todayReward) {
          // Update rewards array
          const updatedRewards = dailyRewards.map((reward) =>
            reward.current
              ? { ...reward, claimed: true, current: false }
              : reward.day === todayReward.day + 1
              ? { ...reward, current: true }
              : reward
          );
          setDailyRewards(updatedRewards);

          toast.success(`Selamat! Kamu mendapat hadiah harian!`);
          onClose();
          onClaimSuccess();
        }
      } else {
        toast.error(response.message || "Gagal mengklaim hadiah!");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error("Terjadi kesalahan saat mengklaim hadiah!");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="xl"
        className="max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-cyan-600" />
              </div>

              <div>
                <DialogTitle className="text-2xl font-bold text-cyan-900">
                  Hadiah Harian
                </DialogTitle>
                <p className="text-cyan-600">
                  Klaim tetesan embun gratis setiap hari
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div>
          {/* Statistik Section */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Streak Card */}
            <Card className="p-4 bg-gradient-to-r from-orange-100 to-red-100">
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="font-bold text-xl text-orange-900">
                  Streak Saat Ini
                </h3>
                <p className="text-2xl font-bold text-orange-700">
                  {streak} Hari
                </p>
              </div>
            </Card>

            {/* Water Drops Card */}
            <Card className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100">
              <div className="text-center">
                <div className="text-3xl mb-2">💧</div>
                <h3 className="font-bold text-xl text-cyan-900">Tetesan Air</h3>
                <p className="text-2xl font-bold text-cyan-700">{waterDrops}</p>
              </div>
            </Card>
          </div>

          {/* Kalender Reward Section */}
          <div className="mb-6">
            <h3 className="font-bold text-xl text-purple-900 mb-4">
              Kalender Hadiah Mingguan
            </h3>

            <div className="grid grid-cols-7 gap-2">
              {dailyRewards.map((reward, index) => (
                <motion.div
                  key={reward.day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-3 rounded-lg border-2 text-center ${
                    reward.current
                      ? "border-cyan-400 bg-cyan-50"
                      : reward.claimed
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {/* Status Klaim */}
                  {reward.current && (
                    <div className="absolute -top-2 -right-2 bg-cyan-400 text-white text-xs px-2 py-1 rounded-full">
                      Klaim
                    </div>
                  )}
                  {reward.claimed && (
                    <div className="absolute -top-2 -right-2">🔥</div>
                  )}

                  {/* Detail Reward */}
                  <div className="text-sm font-semibold text-gray-700">
                    Hari {reward.day}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">💧</div>
                  <div className="text-lg font-bold text-cyan-700">
                    {reward.reward}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tombol Klaim */}
          {canClaimReward && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={handleClaimReward}
                disabled={isClaiming}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 
                     hover:from-cyan-600 hover:to-blue-600 
                     text-white text-lg py-4"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Klaim Hadiah Hari Ini"
                )}
              </Button>
            </motion.div>
          )}

          {/* Catatan */}
          <p className="text-center mt-4 text-sm text-gray-500">
            Hadiah harian dapat diklaim setiap 24 jam
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
