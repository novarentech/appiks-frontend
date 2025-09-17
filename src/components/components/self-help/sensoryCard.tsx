"use client";

import { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck } from "lucide-react";

const activities = [
  {
    label: "Cuci tangan dengan air mengalir",
    type: "Sentuhan",
  },
  {
    label: "Mandi air dingin (saat merasa jenuh dan butuh segar)",
    type: "Sentuhan",
  },
  {
    label:
      "Mandi air hangat (saat merasa sangat lelah, frustasi, dan membutuhkan fokus ketenangan)",
    type: "Sentuhan",
  },
  {
    label:
      "Minum air dingin atau hangat (preferensi air sama seperti saat mandi)",
    type: "Sentuhan",
  },
  {
    label: "Gunakan aromaterapi, hirup perlahan",
    type: "Sentuhan",
  },
  {
    label: "Berjalan tanpa alas kaki, rasakan sensasi di telapak kaki",
    type: "Sentuhan",
  },
];

export default function SensoryRelaxationCard() {
  const [selected, setSelected] = useState<number[]>([]);
  const [reflection, setReflection] = useState("");

  const handleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSave = () => {
    const payload = {
      activities: selected.map((i) => activities[i].label),
      reflection,
    };
    console.log("📒 Journal disimpan:", payload);
  };

  return (
    <>
      <Card className="w-full max-w-5xl">
        <CardContent className="p-6 sm:p-10">
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Tenangkan diri lewat pengalaman sensori sederhana
          </h2>
          <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
            Lakukan aktivitas berikut dengan penuh kesadaran, lalu perhatikan
            perubahan sensasi yang muncul dalam diri.
          </p>

          {/* Mascot */}
          <div className="flex justify-center mb-10">
            <Image
              src="/image/mascot-sensory.webp"
              alt="Sensory Mascot"
              width={300}
              height={244}
              priority
            />
          </div>

          {/* Aktivitas */}
          <div className="mb-10">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Pilih Aktivitas
            </h3>
            <div className="flex flex-col gap-3">
              {activities.map((act, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={`flex items-center justify-between w-full rounded-xl border px-5 py-4 text-left transition-all ${
                    selected.includes(idx)
                      ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm"
                      : "bg-white border-gray-200 text-gray-700 hover:border-indigo-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(idx)}
                      readOnly
                      className="min-w-4 min-h-4 accent-indigo-500"
                    />
                    <span className="text-base leading-snug">{act.label}</span>
                  </div>
                  <span className="text-sm shrink-0">
                    {act.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Refleksi */}
          <div className="mb-10">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Refleksi
            </h3>
            <p className="text-gray-500 text-sm mb-3">
              Bagaimana perasaanmu setelah melakukan kegiatan ini?
            </p>
            <Textarea
              className="w-full min-h-40"
              placeholder="Bagaimana rasanya setelah melakukan ini?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      {/* Tombol Simpan */}
      <div className="flex justify-end mt-7">
        <Button
          onClick={handleSave}
          disabled={selected.length === 0 || reflection.trim() === ""}
        >
          Simpan Journal
          <CheckCheck className="ml-2" />
        </Button>
      </div>
    </>
  );
}
