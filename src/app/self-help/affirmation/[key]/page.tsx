"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, RotateCw, Speech } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSpeech } from "@/hooks/useSpeech";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

const affirmations = {
  calm: [
    '"Aku aman, aku kuat, aku pasti bisa melewati ini."',
    '"Aku menarik napas dalam-dalam dan membiarkan ketenangan mengalir."',
  ],
  sadness: [
    '"Aku menerima kegagalan sebagai bagian dari proses belajar."',
    '"Aku berhak untuk merasa sedih, tapi aku juga berhak untuk bangkit."',
  ],
  acceptance: [
    '"Aku menerima diriku apa adanya."',
    '"Aku layak dicintai dan dihargai."',
  ],
  confidence: [
    '"Aku percaya pada kemampuanku."',
    '"Aku pantas untuk sukses dan bahagia."',
  ],
};

const cardMeta = {
  calm: {
    title: "Tenang & Atasi Cemas",
    desc: "Kalimat positif untuk membantu menenangkan pikiran.",
    color: "border-violet-200 bg-violet-50",
  },
  sadness: {
    title: "Hadapi Kegagalan & Kesedihan",
    desc: "Kalimat positif untuk menguatkan hati saat menghadapi hal sulit.",
    color: "border-sky-200 bg-sky-50",
  },
  acceptance: {
    title: "Penerimaan Diri",
    desc: "Kalimat positif untuk belajar mencintai dan menerima diri apa adanya.",
    color: "border-yellow-200 bg-yellow-50",
  },
  confidence: {
    title: "Percaya Diri",
    desc: "Kalimat positif untuk menumbuhkan keyakinan pada diri sendiri.",
    color: "border-pink-200 bg-pink-50",
  },
};

export default function AffirmationDetail() {
  return (
    <RoleGuard permissionType="student-only">
      <AffirmationDetailContent />
    </RoleGuard>
  );
}

function AffirmationDetailContent() {
  const { speak, speaking } = useSpeech();
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleNewAffirmation = () => {
    setIdx((i) => (i + 1) % affirmations[key].length);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 600); // stop animasi setelah 600ms
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const params = useParams();
  const key = params?.key as keyof typeof affirmations;
  const [idx, setIdx] = useState(0);

  if (!key || !affirmations[key]) return null;

  const meta = cardMeta[key];

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
          Afirmasi Diri (Self-Affirmation)
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Kata-kata positif untuk membangun semangat dan kepercayaan dirimu
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-10">
          <div className="text-center font-semibold text-lg mb-1">
            {meta.title}
          </div>
          <div className="text-center text-gray-500 mb-6 text-sm">
            {meta.desc}
          </div>
          <div
            className={`rounded-xl ${meta.color} border p-6 text-center text-lg font-medium mb-6`}
          >
            {affirmations[key][idx]}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Kalimat Baru */}
            <Button
              type="button"
              onClick={handleNewAffirmation}
              className="bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Kalimat Baru
              <RotateCw
                className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`}
              />
            </Button>

            {/* Suara */}
            <Button
              type="button"
              onClick={() => speak(affirmations[key][idx])}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              {speaking ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sedang Dibaca...
                </>
              ) : (
                <>
                  <span>Suara</span> <Speech className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
