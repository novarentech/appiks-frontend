"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const activityData = {
  walk: {
    title: "Berjalan Santai",
    desc: "Luangkan waktu beberapa menit untuk jalan kaki agar tubuh terasa lebih segar.",
    img: "/image/physical-walk.webp",
    tips: [
      "Jalan kaki sebentar bisa bikin aliran darah lebih lancar.",
      "Coba jalan tanpa sambil main HP, biar lebih fokus sama sekitar.",
      "Dengarkan musik atau podcast favorit biar lebih seru.",
      "Jalan bareng teman bisa bikin tambah semangat.",
      "Ambil rute berbeda sesekali supaya nggak bosan.",
    ],
  },
  sun: {
    title: "Berjemur di Pagi Hari",
    desc: "Berjemur sebentar bisa membantu tubuh mendapatkan energi dan vitamin alami.",
    img: "/image/physical-sun.webp",
    tips: [
      "Berjemur 10-15 menit di pagi hari.",
      "Gunakan tabir surya jika perlu.",
      "Pilih waktu sebelum jam 9 pagi.",
      "Jangan menatap matahari langsung.",
    ],
  },
  stretch: {
    title: "Stretching / Peregangan",
    desc: "Lakukan peregangan sederhana untuk mengurangi kaku di tubuh dan membuat lebih rileks.",
    img: "/image/physical-stretch.webp",
    tips: [
      "Lakukan peregangan sebelum dan sesudah aktivitas.",
      "Fokus pada otot yang terasa kaku.",
      "Jangan memaksakan gerakan.",
      "Bernapas perlahan saat peregangan.",
    ],
  },
  "light-exercise": {
    title: "Olahraga Ringan",
    desc: "Coba gerakan olahraga ringan sesuai kemampuan untuk menjaga tubuh tetap aktif.",
    img: "/image/physical-exercise.webp",
    tips: [
      "Pilih olahraga yang kamu suka.",
      "Lakukan pemanasan sebelum mulai.",
      "Minum air yang cukup.",
      "Akhiri dengan pendinginan.",
    ],
  },
};

const durations = [10, 15, 20];

export default function PhysicalActivityDetail() {
  const { key } = useParams();
  const data = activityData[key as keyof typeof activityData];
  const [duration, setDuration] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer
  const handleStart = () => {
    if (duration) {
      setTimer(duration * 60);
      setRunning(true);
    }
  };

  // Reset timer
  const handleReset = () => {
    setRunning(false);
    setTimer(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Timer countdown effect
  useEffect(() => {
    if (running && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setRunning(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, timer]);

  // Format timer mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Aktivitas tidak ditemukan.
      </div>
    );
  }

  

  return (
    <Card>
      <CardContent className="p-6 sm:p-10">
        <div className="text-center font-semibold text-lg mb-1">
          {data.title}
        </div>
        <div className="text-center text-gray-500 mb-6 text-sm">
          {data.desc}
        </div>
        <div className="flex justify-center mb-6">
          <Image src={data.img} alt={data.title} width={120} height={120} />
        </div>
        <div className="flex justify-center gap-3 mb-6">
          {durations.map((d) => (
            <Button
              key={d}
              variant={duration === d ? "default" : "outline"}
              onClick={() => setDuration(d)}
              className="min-w-[80px]"
            >
              {d} Menit
            </Button>
          ))}
        </div>
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl font-mono text-violet-500 mb-2">
            {timer > 0
              ? formatTime(timer)
              : duration
              ? formatTime(duration * 60)
              : "00:00"}
          </span>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!duration && !timer}
            >
              Ulang ↻
            </Button>
            <Button onClick={handleStart} disabled={!duration || running}>
              Mulai ▶
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5 mt-4">
          <div className="font-semibold text-violet-700 mb-2">Tips</div>
          <ol className="list-decimal pl-5 text-violet-700 text-sm space-y-1">
            {data.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
