"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCirrusData } from "@/lib/api";
import type { CirrusResponse } from "@/types/api";

interface DailyReward {
  day: number;
  reward: number;
  claimed: boolean;
  current?: boolean;
}

interface GameState {
  waterDrops: number;
  happiness: number;
  experience: number;
  level: number;
  streak: number;
  canClaimReward: boolean;
  dailyRewards: DailyReward[];
  isLoading: boolean;
}

export function useGameData() {
  const [gameState, setGameState] = useState<GameState>({
    waterDrops: 0,
    happiness: 0,
    experience: 0,
    level: 1,
    streak: 0,
    canClaimReward: false,
    dailyRewards: [
      { day: 1, reward: 50, claimed: false },
      { day: 2, reward: 60, claimed: false },
      { day: 3, reward: 70, claimed: false },
      { day: 4, reward: 80, claimed: false, current: false },
      { day: 5, reward: 100, claimed: false },
      { day: 6, reward: 120, claimed: false },
      { day: 7, reward: 200, claimed: false },
    ],
    isLoading: true,
  });

  const loadGameData = async () => {
    setGameState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response: CirrusResponse = await getCirrusData();

      if (response.success && response.data) {
        const data = response.data;

        // Check if can claim reward based on last_in timestamp
        let canClaimReward = false;
        if (data.last_in) {
          const lastIn = new Date(data.last_in);
          const now = new Date();
          const diffHours =
            (now.getTime() - lastIn.getTime()) / (1000 * 60 * 60);
          canClaimReward = diffHours >= 24;
        }

        // Update daily rewards based on streak
        const updatedRewards = gameState.dailyRewards.map((reward, index) => ({
          ...reward,
          claimed: index < data.streak,
          current: index === data.streak && data.streak < 7,
        }));

        setGameState((prev) => ({
          ...prev,
          waterDrops: data.water,
          happiness: data.happiness,
          experience: data.exp,
          level: data.level,
          streak: data.streak,
          canClaimReward,
          dailyRewards: updatedRewards,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error loading game data:", error);
      toast.error("Gagal memuat data game!");
      setGameState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Load data on mount
  useEffect(() => {
    loadGameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update functions
  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  const setDailyRewards = (rewards: DailyReward[]) => {
    setGameState((prev) => ({ ...prev, dailyRewards: rewards }));
  };

  return {
    ...gameState,
    loadGameData,
    updateGameState,
    setDailyRewards,
  };
}
