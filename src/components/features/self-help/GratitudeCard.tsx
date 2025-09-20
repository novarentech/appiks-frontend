"use client";

import { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck, PlusCircle } from "lucide-react";

export default function GratitudeCard() {
  const [achievement, setAchievement] = useState("");
  const [progress, setProgress] = useState<string[]>(["", "", ""]);
  const [selfAppreciation, setSelfAppreciation] = useState("");

  return (
    <>
      <Card className="w-full max-w-5xl rounded-3xl shadow-lg p-0 border-0">
        <CardContent className="p-0">
          <div className="p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              Apresiasi Diri & Harimu
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Bagikan hal-hal yang membuatmu bangga dan bersyukur.
            </p>
            <div className="flex justify-center mb-8">
              <Image
                src="/image/mascot-gratitude.webp"
                alt="Mascot"
                width={300}
                height={244}
                priority
              />
            </div>

            {/* Apa yang berhasil dicapai */}
            <div className="mb-8">
              <h2 className="font-semibold text-lg text-gray-800 mb-1">
                Apa yang berhasil kamu capai hari ini?
              </h2>
              <Textarea
                className="w-full min-h-40"
                rows={2}
                placeholder="Aku akhirnya berani presentasi"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
              />
            </div>

            {/* Kemajuan/Pencapaian Hari Ini */}
            <div className="mb-8">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                Kemajuan/Pencapaian Hari Ini
              </h2>
              <div className="space-y-3">
                {progress.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-gray-400 font-semibold">
                      {idx + 1}.
                    </span>
                    <Input
                      className="flex-1 border-gray-200 rounded-lg text-sm"
                      placeholder={
                        idx === 0
                          ? "Contoh: Aku sabar menolong adik"
                          : idx === 1
                          ? "Contoh: Aku tidak menyerah mengerjakan soal matematika"
                          : "Contoh: Aku jujur"
                      }
                      value={val}
                      onChange={(e) => {
                        const newProgress = [...progress];
                        newProgress[idx] = e.target.value;
                        setProgress(newProgress);
                      }}
                    />
                    {progress.length > 1 && (
                      <button
                        type="button"
                        aria-label="Hapus baris"
                        className="text-gray-300 hover:text-red-500 px-1"
                        onClick={() => {
                          setProgress(progress.filter((_, i) => i !== idx));
                        }}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 transition-all"
                  onClick={() => setProgress([...progress, ""])}
                >
                  <PlusCircle className="w-4 h-4" />
                  Tambah baris
                </Button>
              </div>
            </div>

            {/* Apresiasi untuk Diri Sendiri */}
            <div className="mb-8">
              <h2 className="font-semibold text-lg text-gray-800 mb-1">
                Apresiasi untuk Diri Sendiri
              </h2>
              <Textarea
                className="w-full min-h-40"
                rows={2}
                placeholder="Hari ini, aku bangga pada diriku karena…"
                value={selfAppreciation}
                onChange={(e) => setSelfAppreciation(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Tombol Simpan */}
      <div className="flex justify-end mt-7">
        <Button
          type="button"
          disabled={
            !achievement ||
            progress.length < 1 ||
            progress.slice(0, 1).some((p) => p.trim() === "") ||
            !selfAppreciation
          }
        >
          Simpan Journal
          <CheckCheck />
        </Button>
      </div>
    </>
  );
}
