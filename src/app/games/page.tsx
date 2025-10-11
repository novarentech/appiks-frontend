"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Droplet, Droplets, Gift, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function GamesPage() {
  const [waterDrops, setWaterDrops] = useState(122);
  const [happiness, setHappiness] = useState(15);
  const [experience, setExperience] = useState(50);
  const [isCloudHappy, setIsCloudHappy] = useState(false);
  const [tapCooldown, setTapCooldown] = useState(false);
  const [showFoodStore, setShowFoodStore] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(2);
  const [canClaimReward, setCanClaimReward] = useState(true);

  // Cute effects: particles and ripples
  const cloudRef = useRef<HTMLDivElement | null>(null);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      emoji: string;
      driftX: number;
      driftY: number;
      rotate: number;
    }>
  >([]);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const foods = [
    {
      id: 1,
      name: "Dew Crystals",
      description: "Kristal murni yang terbentuk dari embun pagi",
      icon: "/image/games/dew.webp",
      price: 20,
      happinessBoost: 10,
      xpBoost: 5,
    },
    {
      id: 2,
      name: "Starlight Mote",
      description: "Serpihan cahaya dari bintang yang paling terang",
      icon: "/image/games/star.webp",
      price: 50,
      happinessBoost: 25,
      xpBoost: 20,
    },
    {
      id: 3,
      name: "Rainbow Dust",
      description: "Debu ajaib dari pelangi yang muncul setelah hujan",
      icon: "/image/games/rainbow.webp",
      price: 90,
      happinessBoost: 40,
      xpBoost: 30,
    },
    {
      id: 4,
      name: "Sunlight",
      description: "Energi murni dari inti matahari yang memberi kehangatan",
      icon: "/image/games/sun.webp",
      price: 100,
      happinessBoost: 3,
      xpBoost: 5,
    },
  ];

  const dailyRewards = [
    { day: 1, reward: 50, claimed: true },
    { day: 2, reward: 60, claimed: true },
    { day: 3, reward: 70, claimed: true },
    { day: 4, reward: 80, claimed: false, current: true },
    { day: 5, reward: 100, claimed: false },
    { day: 6, reward: 120, claimed: false },
    { day: 7, reward: 200, claimed: false },
  ];

  const spawnRipple = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 900);
  };

  const spawnParticles = (x: number, y: number) => {
    const emojis = ["💧", "✨", "💙", "☁️"];
    const count = 8;
    const created: Array<{
      id: number;
      x: number;
      y: number;
      emoji: string;
      driftX: number;
      driftY: number;
      rotate: number;
    }> = [];
    for (let i = 0; i < count; i++) {
      const id = Date.now() + Math.random() + i;
      const driftX = (Math.random() - 0.5) * 80; 
      const driftY = 60 + Math.random() * 80;
      const rotate = (Math.random() - 0.5) * 40; 
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      created.push({ id, x, y, emoji, driftX, driftY, rotate });
      // schedule removal
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1300);
    }
    setParticles((prev) => [...prev, ...created]);
  };

  const handleCloudClick = (e?: ReactMouseEvent<HTMLDivElement>) => {
    // Tap hanya memicu animasi/feedback, tidak menambah XP atau kebahagiaan
    if (tapCooldown) return;
    setTapCooldown(true);
    setIsCloudHappy(true);
    toast("Cirrus senang berinteraksi denganmu! 🌤️");
    // Spawn cute effects at click position
    if (cloudRef.current && e) {
      const rect = cloudRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnRipple(x, y);
      spawnParticles(x, y);
    }
    // Matikan animasi lebih cepat agar terasa responsif
    setTimeout(() => setIsCloudHappy(false), 1200);
    setTimeout(() => setTapCooldown(false), 800);
  };

  const handleBuyFood = (food: (typeof foods)[0]) => {
    if (waterDrops >= food.price) {
      setWaterDrops((prev) => prev - food.price);
      setHappiness((prev) => Math.min(prev + food.happinessBoost, 100));
      setExperience((prev) => Math.min(prev + food.xpBoost, 100));
      toast.success(
        `Cirrus menikmati ${food.name}! Kebahagiaan +${food.happinessBoost}%, XP +${food.xpBoost}`
      );
      setShowFoodStore(false);
    } else {
      toast.error("Tetesan embun tidak cukup!");
    }
  };

  const handleClaimReward = () => {
    if (canClaimReward) {
      const todayReward = dailyRewards.find((r) => r.current);
      if (todayReward) {
        setWaterDrops((prev) => prev + todayReward.reward);
        setDailyStreak((prev) => prev + 1);
        setCanClaimReward(false);
        toast.success(
          `Selamat! Kamu mendapat ${todayReward.reward} tetesan embun!`
        );
        setShowDailyReward(false);
      }
    }
  };

  return (
    <>
      {/* Main Game Page */}
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-12 w-32 h-32 bg-white/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/6 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-32 left-16 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-500" />
          <div className="absolute bottom-48 right-14 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse delay-300" />
          <div className="absolute top-1/2 left-1/4 w-36 h-36 bg-white/4 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        {/* Header Section */}
        <div className="relative z-10 pt-10 pb-6">
          {/* Water Drops Display */}
          <div className="flex justify-center">
            <motion.div
              className="bg-white/15 backdrop-blur-xl rounded-full px-8 py-4 flex items-center gap-4 sm:gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/30 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center rounded-full">
                <Droplets className="w-6 h-6 text-white drop-shadow" />
              </div>
              <div>
                <div className="text-white/80 text-xs sm:text-sm font-medium mb-0.5">
                  Total Tetesan Air
                </div>
                <motion.div
                  className="text-white text-2xl font-bold drop-shadow-lg"
                  key={waterDrops}
                  initial={{ scale: 1.3, color: "#fbbf24" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {waterDrops}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center min-h-[600px]">
              {/* Left: Pet Status Card */}
              <div className="xl:col-span-3">
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl p-6 sm:p-8 rounded-3xl hover:bg-white/20 transition-all duration-500">
                    {/* Header */}
                    <div className="text-center mb-7">
                      <div className="text-white text-3xl sm:text-4xl font-bold tracking-tight drop-shadow">
                        Cirrus
                      </div>
                      <div className="text-white/90 mt-1 text-sm">Level 1</div>
                    </div>

                    {/* Stats – using shadcn Progress */}
                    <div className="space-y-6">
                      {/* Kebahagiaan */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-white/90 text-sm font-semibold">
                            Kebahagiaan
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white font-medium border border-white/20">
                            {happiness}%
                          </span>
                        </div>
                        <Progress
                          value={happiness}
                          className="h-8 bg-white/15 border border-white/20"
                          indicatorClassName="bg-gradient-to-r from-indigo-300 via-sky-400 to-blue-500"
                        />
                      </div>

                      {/* Pengalaman */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-white/90 text-sm font-semibold">
                            Pengalaman
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white font-medium border border-white/20">
                            {experience} XP
                          </span>
                        </div>
                        <Progress
                          value={experience}
                          className="h-8 bg-white/15 border border-white/20"
                          indicatorClassName="bg-gradient-to-r from-sky-300 via-blue-500 to-indigo-600"
                        />
                        <div className="mt-2 flex items-center justify-between text-[12px]">
                          <span className="text-white/80 font-medium">
                            {experience}/100 XP
                          </span>
                          <span className="text-white/80">Level 2</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Center: Cloud Pet */}
              <div className="xl:col-span-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  className="relative flex flex-col items-center justify-center h-full min-h-[520px]"
                >
                  {/* Subtle floating shimmer */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-10 top-10 w-20 h-20 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute right-10 top-20 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
                  </div>

                  {/* Cloud Character */}
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -4, 4, -2, 2, 0],
                      filter: "brightness(1.2)",
                    }}
                    whileTap={{ scale: 0.92, y: 2 }}
                    animate={
                      isCloudHappy
                        ? {
                            scale: [1, 1.25, 1.1, 1],
                            rotate: [0, -12, 12, -6, 6, 0],
                            y: [0, -25, -10, 0],
                          }
                        : {
                            y: [0, -8, 0],
                            rotate: [0, 3, -3, 0],
                            scale: [1, 1.02, 1], 
                          }
                    }
                    transition={{
                      duration: isCloudHappy ? 2 : 5,
                      repeat: isCloudHappy ? 0 : Infinity,
                      ease: "easeInOut",
                    }}
                    onClick={(e) => handleCloudClick(e)}
                    className="cursor-pointer select-none relative z-20 group"
                  >
                    <div className="relative" ref={cloudRef}>
                      <div className="relative p-6 sm:p-8">
                        <Image
                          src={
                            isCloudHappy
                              ? "/image/games/cirrus_click.webp"
                              : happiness < 50
                              ? "/image/games/cirrus_sad.webp"
                              : "/image/games/cirrus_neutral.webp"
                          }
                          alt="Cloud Pet"
                          width={340}
                          height={250}
                          className="select-none drop-shadow-2xl"
                          priority
                        />
                      </div>

                      {/* Glow Effects */}
                      {isCloudHappy && (
                        <>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-yellow-300/40 to-pink-300/40 rounded-full blur-3xl -z-10"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{
                              opacity: [0, 1, 0.7, 0],
                              scale: [0.6, 2, 1.8, 0.6],
                            }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-full blur-2xl -z-5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: [0, 0.8, 0.5, 0],
                              scale: [0.8, 1.6, 1.4, 0.8],
                            }}
                            transition={{
                              duration: 2,
                              delay: 0.3,
                              ease: "easeOut",
                            }}
                          />
                        </>
                      )}

                      {/* Cute Click Effects Layer */}
                      <div className="pointer-events-none absolute inset-0">
                        {/* Ripples */}
                        <AnimatePresence>
                          {ripples.map((r) => (
                            <motion.span
                              key={r.id}
                              className="absolute block rounded-full border-2 border-cyan-300/60 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                              style={{
                                left: r.x,
                                top: r.y,
                                width: 12,
                                height: 12,
                                marginLeft: -6,
                                marginTop: -6,
                              }}
                              initial={{ opacity: 0.6, scale: 0 }}
                              animate={{ opacity: 0, scale: 6 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          ))}
                        </AnimatePresence>

                        {/* Particles */}
                        <AnimatePresence>
                          {particles.map((p) => (
                            <motion.span
                              key={p.id}
                              className="absolute text-2xl drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]"
                              style={{ left: p.x, top: p.y }}
                              initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
                              animate={{
                                opacity: [0, 1, 1, 0],
                                x: p.driftX,
                                y: -p.driftY,
                                scale: [0.6, 1, 1, 0.8],
                                rotate: p.rotate,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            >
                              {p.emoji}
                            </motion.span>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>

                  {/* Interaction Prompts */}
                  <div className="mt-7 text-center space-y-2">
                    <div className="text-white font-semibold">
                      Klik awan untuk berinteraksi!
                    </div>
                    <div className="text-white/80 text-sm">
                      Gunakan tombol di sebelah kanan untuk berinteraksi
                    </div>
                  </div>

                  <div className="mt-14 text-center text-white/90 font-medium">
                    Nikmati bermain dengan awan peliharaanmu!
                  </div>
                </motion.div>
              </div>

              {/* Right: Action Buttons */}
              <div className="xl:col-span-3">
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
                        onClick={() => setShowFoodStore(true)}
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
                        onClick={() => setShowDailyReward(true)}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Store Dialog */}
      <Dialog open={showFoodStore} onOpenChange={setShowFoodStore}>
        <DialogContent
          size="xl"
          className="max-w-4xl w-full max-h-[90vh] overflow-auto"
        >
          {/* === HEADER === */}
          <DialogHeader>
            <div className="flex items-center justify-between mb-6">
              {/* Left: Title & Subtitle */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-purple-900">
                    Toko Makanan
                  </DialogTitle>
                  <p className="text-purple-600 text-sm">
                    Pilih makanan untuk Cirrus
                  </p>
                </div>
              </div>

              {/* Right: Resource Info */}
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full px-4 py-2 flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <Droplet className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-semibold text-blue-900">
                    {waterDrops} Tetesan Embun
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* === BODY === */}
          <div className="space-y-6">
            {/* Grid List of Foods */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {foods.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-4 text-center h-full flex flex-col">
                    <Image
                      src={food.icon}
                      alt={food.name}
                      width={80}
                      height={80}
                      className="mx-auto mb-3 select-none"
                    />
                    <h3 className="font-bold text-lg text-purple-900 mb-2">
                      {food.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 flex-1">
                      {food.description}
                    </p>

                    {/* Stat Boosts */}
                    <div className="flex flex-col gap-2 mb-4 items-center">
                      <Badge variant="outline" className="text-xs">
                        Kebahagiaan +{food.happinessBoost}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Pengalaman +{food.xpBoost} XP
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                          <Droplet className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-bold text-blue-900">
                          {food.price} Tetesan Embun
                        </span>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Button
                      className={`w-full ${
                        waterDrops >= food.price
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      disabled={waterDrops < food.price}
                      onClick={() => handleBuyFood(food)}
                    >
                      Beli Makanan
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Reward Dialog */}
      <Dialog open={showDailyReward} onOpenChange={setShowDailyReward}>
        <DialogContent
          size="xl"
          className="max-w-4xl w-full max-h-[90vh] overflow-auto"
        >
          {/* === Header === */}
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

          {/* === Body === */}
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
                    {dailyStreak} Hari
                  </p>
                </div>
              </Card>

              {/* Water Drops Card */}
              <Card className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100">
                <div className="text-center">
                  <div className="text-3xl mb-2">💧</div>
                  <h3 className="font-bold text-xl text-cyan-900">
                    Tetesan Air
                  </h3>
                  <p className="text-2xl font-bold text-cyan-700">
                    {waterDrops}
                  </p>
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
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 
                       hover:from-cyan-600 hover:to-blue-600 
                       text-white text-lg py-4"
                >
                  Klaim Hadiah Hari Ini (80 Tetesan Embun)
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
    </>
  );
}
