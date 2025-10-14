"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { toast } from "sonner";

interface CloudPetProps {
  happiness: number;
  onTap?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  driftX: number;
  driftY: number;
  rotate: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CloudPet({ happiness, onTap }: CloudPetProps) {
  const [isCloudHappy, setIsCloudHappy] = useState(false);
  const [tapCooldown, setTapCooldown] = useState(false);
  const cloudRef = useRef<HTMLDivElement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

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
    const created: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const id = Date.now() + Math.random() + i;
      const driftX = (Math.random() - 0.5) * 80;
      const driftY = 60 + Math.random() * 80;
      const rotate = (Math.random() - 0.5) * 40;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      created.push({ id, x, y, emoji, driftX, driftY, rotate });

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1300);
    }
    setParticles((prev) => [...prev, ...created]);
  };

  const handleCloudClick = (e?: ReactMouseEvent<HTMLDivElement>) => {
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

    // Callback untuk parent component
    onTap?.();

    setTimeout(() => setIsCloudHappy(false), 1200);
    setTimeout(() => setTapCooldown(false), 800);
  };

  return (
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
  );
}
