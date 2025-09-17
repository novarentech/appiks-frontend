"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ButterflyHugCard() {
  const initialTime = 2 * 60; // 2 menit (dalam detik)
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Format waktu jadi MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString();
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Start / Pause timer + video
  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      videoRef.current?.pause();
    } else {
      setIsRunning(true);
      videoRef.current?.play();
    }
  };

  // Reset timer + video
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setTimeLeft(initialTime);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Efek jalan timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);
          videoRef.current?.pause();
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  return (
    <Card className="max-w-5xl mx-auto p-6 sm:p-10 md:p-16 lg:p-20 text-center space-y-6">
      {/* Judul & Instruksi */}
      <div className="">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Cara Melakukan Butterfly Hug
        </h1>
        <ol className="text-gray-700 ml-6 text-left space-y-2 list-decimal">
          <li>Silangkan kedua tanganmu di depan dada atau di samping lengan.</li>
          <li>Tepuk perlahan dan lembut, rasakan sensasi tenangnya di tubuhmu.</li>
          <li>
            Ucapkan kata-kata ajaibmu sambil menepuk, misalnya: “Aku bisa”, “Nggak
            apa-apa”, atau “Semua akan berlalu.”
          </li>
        </ol>
      </div>

      {/* Video */}
      <div className="flex justify-center">
        <video
          ref={videoRef}
          src="/videos/butterfly-hug.webm"
          width={300}
          height={300}
          loop
          playsInline
          className="rounded-xl"
        />
      </div>

      {/* Timer */}
      <div className="text-4xl font-bold text-primary">{formatTime(timeLeft)}</div>

      {/* Tombol kontrol */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={resetTimer}
        >
          <RotateCcw className="w-4 h-4" />
          Ulang
        </Button>
        <Button
          className="flex items-center gap-2"
          onClick={toggleTimer}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Mulai
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
