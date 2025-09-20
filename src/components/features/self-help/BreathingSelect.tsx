"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const breathingOptions = [
  {
    key: "short",
    label: "Pendek",
    duration: "1.5 Menit",
    color: "border-teal-200 bg-teal-50 hover:border-teal-400",
    icon: "/icon/ico-play-green.webp",
  },
  {
    key: "medium",
    label: "Sedang",
    duration: "4 Menit",
    color: "border-sky-200 bg-sky-50 hover:border-sky-400",
    icon: "/icon/ico-play-blue.webp",
  },
  {
    key: "long",
    label: "Panjang",
    duration: "12 Menit",
    color: "border-pink-200 bg-pink-50 hover:border-pink-400",
    icon: "/icon/ico-play-pink.webp",
  },
];

export default function BreathingSelect() {
  const router = useRouter();

  return (
    <Card className="max-w-5xl ">
      <CardContent className="p-6 sm:p-10">
        <div className="text-center font-semibold text-lg mb-1">
          Tenangkan Pikiranmu
        </div>
        <div className="text-center text-gray-500 mb-6 text-sm">
          Tarik napas dalam, hembuskan perlahan, dan rasakan ketenangan.
        </div>
        <div className="flex justify-center mb-8">
          <Image
            src="/image/mascot-gratitude.webp"
            alt="maskot"
            width={200}
            height={200}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {breathingOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`rounded-xl border min-h-[180px] p-6 flex flex-col items-center transition-all ${opt.color}`}
              onClick={() => router.push(`/self-help/breathing/${opt.key}`)}
            >
              <Image
                src={opt.icon}
                alt={opt.label}
                width={48}
                height={48}
                className="mb-2"
              />
              <div className="font-semibold text-lg mb-1">{opt.label}</div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                {opt.duration}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
