"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, RotateCw, Play } from "lucide-react";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

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
      "Waktu terbaik berjemur biasanya sebelum jam 10 pagi.",
      "Nggak perlu lama, cukup 10–15 menit aja.",
      "Gunakan pakaian nyaman biar sinar matahari lebih terasa.",
      "Bisa sambil stretching ringan biar makin maksimal.",
      "Jangan lupa minum air putih setelah berjemur.",
    ],
  },
  stretch: {
    title: "Stretching / Peregangan",
    desc: "Lakukan peregangan sederhana untuk mengurangi kaku di tubuh dan membuat lebih rileks.",
    img: "/image/physical-stretch.webp",
    tips: [
      "Mulai dari leher, bahu, lalu turun ke punggung dan kaki.",
      "Jangan terburu-buru, tarik napas perlahan saat peregangan.",
      "Lakukan 5 menit setiap habis duduk lama.",
      "Bisa sambil mendengarkan musik tenang.",
      "Hindari gerakan yang bikin sakit, cukup sampai terasa nyaman.",
    ],
  },
  "light-exercise": {
    title: "Olahraga Ringan",
    desc: "Coba gerakan simpel seperti jumping jacks, plank, atau yoga sesuai kemampuanmu.",
    img: "/image/physical-exercise.webp",
    tips: [
      "Pilih gerakan sederhana seperti jumping jacks, plank, atau squat.",
      "Sesuaikan durasi dengan energimu, nggak perlu terlalu lama.",
      "Gunakan alas kaki/alas yoga biar lebih nyaman.",
      "Minum air putih sebelum dan sesudah olahraga.",
      "Lakukan pemanasan sebentar supaya badan nggak kaget.",
    ],
  },
};

const durations = [10, 15, 20];

export default function PhysicalActivityDetail() {
  return (
    <RoleGuard permissionType="student-only">
      <PhysicalActivityDetailContent />
    </RoleGuard>
  );
}

function PhysicalActivityDetailContent() {
  const { key } = useParams();
  const data = activityData[key as keyof typeof activityData];
  const [duration, setDuration] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

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

    // trigger spin animasi
    setSpinning(true);
    setTimeout(() => setSpinning(false), 700);
  };

  // Timer countdown effect
  useEffect(() => {
    if (running) {
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
  }, [running]); 

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
    <div className="min-h-screen max-w-6xl container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group"
          onClick={handleGoToDashboard}
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
          Ke Halaman Dashboard
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Aktivitas Fisik
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Pilih aktivitas sederhana untuk menjaga tubuh tetap sehat dan segar.
        </p>
      </div>

      {/* card */}
      <Card>
        <CardContent className="p-6 sm:p-10">
          <div className="text-center font-semibold text-xl mb-1">
            {data.title}
          </div>
          <div className="text-center text-gray-500 mb-6 text-base">
            {data.desc}
          </div>
          <div className="flex justify-center mb-6">
            <Image src={data.img} alt={data.title} width={280} height={280} />
          </div>

          {/* Durasi */}
          <div className="flex justify-center gap-3 mb-6">
            {durations.map((d) => (
              <Button
                key={d}
                variant={duration === d ? "default" : "outline"}
                onClick={() => setDuration(d)}
                className="min-w-[90px]"
              >
                {d} Menit
              </Button>
            ))}
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center mb-6">
            <span className="text-5xl font-semibold text-violet-600 mb-4">
              {timer > 0
                ? formatTime(timer)
                : duration
                ? formatTime(duration * 60)
                : "00:00"}
            </span>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!duration && !timer}
                className="flex items-center gap-2"
              >
                <RotateCw
                  className={`h-5 w-5 ${spinning ? "animate-spin" : ""}`}
                />
                Ulang
              </Button>
              <Button
                onClick={handleStart}
                disabled={!duration || running}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Play className="h-5 w-5" />
                Mulai
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-5 mt-4">
            <div className="font-semibold text-violet-700 mb-3">Tips</div>
            <ol className="list-decimal pl-5 text-violet-700 text-sm space-y-1">
              {data.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
