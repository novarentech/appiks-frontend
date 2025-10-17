"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, LayoutDashboard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CloudPet,
  GameStats,
  WaterDisplay,
  ActionButtons,
  FoodStoreModal,
  DailyRewardModal,
} from "@/components/games";
import { useGameData } from "@/hooks/useGameData";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function GamesPage() {
  return (
    <RoleGuard permissionType="student-only">
      <GamesContent />
    </RoleGuard>
  );
}

function GamesContent() {
  const {
    waterDrops,
    happiness,
    experience,
    level,
    streak,
    canClaimReward,
    dailyRewards,
    isLoading,
    loadGameData,
    setDailyRewards,
  } = useGameData();

  const [showFoodStore, setShowFoodStore] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center">
        {/* Top-left Dashboard Button */}
        <div className="absolute top-4 left-4 z-20 hidden lg:block">
          <Link href="/dashboard">
            <Button
              size="sm"
              className="backdrop-blur-sm bg-white/20 text-white border border-white/30 hover:bg-white/30"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Memuat data game...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Game Page */}
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 relative overflow-hidden py-4">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-12 w-32 h-32 bg-white/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/6 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-32 left-16 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-500" />
          <div className="absolute bottom-48 right-14 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse delay-300" />
          <div className="absolute top-1/2 left-1/4 w-36 h-36 bg-white/4 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        {/* Header Section with Water Display */}
        <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
            <div className="justify-self-start hidden lg:block">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/80"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </div>
            <div className="justify-self-center">
              <WaterDisplay waterDrops={waterDrops} />
            </div>
            <div className="justify-self-end hidden lg:block" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center min-h-[600px]">
              {/* Left: Pet Status Card */}
              <div className="xl:col-span-3">
                <GameStats
                  level={level}
                  happiness={happiness}
                  experience={experience}
                />
              </div>

              {/* Center: Cloud Pet */}
              <div className="xl:col-span-6">
                <CloudPet
                  happiness={happiness}
                  onTap={() => {
                    // Optional callback for future features
                  }}
                />
              </div>

              {/* Right: Action Buttons */}
              <div className="xl:col-span-3">
                <ActionButtons
                  canClaimReward={canClaimReward}
                  onFoodStoreClick={() => setShowFoodStore(true)}
                  onDailyRewardClick={() => setShowDailyReward(true)}
                />
                {/* Mobile-only Dashboard Button */}
                <div className="lg:hidden mt-4 mx-auto w-max">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/80"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Store Modal */}
      <FoodStoreModal
        isOpen={showFoodStore}
        onClose={() => setShowFoodStore(false)}
        waterDrops={waterDrops}
        isBuying={isBuying}
        setIsBuying={setIsBuying}
        onPurchaseSuccess={loadGameData}
      />

      {/* Daily Reward Modal */}
      <DailyRewardModal
        isOpen={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        streak={streak}
        waterDrops={waterDrops}
        canClaimReward={canClaimReward}
        isClaiming={isClaiming}
        setIsClaiming={setIsClaiming}
        dailyRewards={dailyRewards}
        setDailyRewards={setDailyRewards}
        onClaimSuccess={loadGameData}
      />
    </>
  );
}
