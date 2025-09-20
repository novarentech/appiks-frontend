"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const activities = [
  {
    key: "walk",
    color: "border-violet-200 bg-violet-50 hover:border-violet-400",
    icon: "/image/physical-walk.webp",
    title: "Berjalan Santai",
    desc: "Luangkan waktu beberapa menit untuk jalan kaki agar tubuh terasa lebih segar.",
  },
  {
    key: "sun",
    color: "border-yellow-200 bg-yellow-50 hover:border-yellow-400",
    icon: "/image/physical-sun.webp",
    title: "Berjemur di Pagi Hari",
    desc: "Berjemur sebentar bisa membantu tubuh mendapatkan energi dan vitamin alami.",
  },
  {
    key: "stretch",
    color: "border-cyan-200 bg-cyan-50 hover:border-cyan-400",
    icon: "/image/physical-stretch.webp",
    title: "Stretching / Peregangan",
    desc: "Lakukan peregangan sederhana untuk mengurangi kaku di tubuh dan membuat lebih rileks.",
  },
  {
    key: "light-exercise",
    color: "border-pink-200 bg-pink-50 hover:border-pink-400",
    icon: "/image/physical-exercise.webp",
    title: "Olahraga Ringan",
    desc: "Coba gerakan olahraga ringan sesuai kemampuan untuk menjaga tubuh tetap aktif.",
  },
];

export default function PhysicalActivitySelect() {
  const router = useRouter();

  return (
    <Card className="max-w-5xl">
      <CardContent className="p-6 sm:p-10">
        <div className="text-center font-semibold text-lg mb-1">
          Ayo Lakukan Aktivitas Fisik Berikut !
        </div>
        <div className="text-center text-gray-500 mb-6 text-sm">
          Tetap aktif dengan gerakan sederhana yang bikin tubuh lebih sehat dan
          pikiran lebih segar.
        </div>
        <div className="flex justify-center mb-8">
          <Image
            src="/image/mascot-physical-activity.webp"
            alt="maskot"
            width={250}
            height={250}
          />
        </div>
        <div className="flex flex-col gap-4 items-stretch">
          {activities.map((act) => (
            <button
              key={act.key}
              type="button"
              className={`rounded-xl border p-5 flex items-center gap-4 transition-all max-h-[100px] ${act.color} group w-full`}
              onClick={() =>
                router.push(`/self-help/physical-activity/${act.key}`)
              }
            >
              <Image src={act.icon} alt={act.title} width={60} height={60} />
              <div className="flex-1 text-left">
                <div className="font-semibold text-base mb-1">{act.title}</div>
                <div className="text-sm text-gray-500">{act.desc}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
