"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SurveyResultData } from "@/types/survey";

export default function SurveyResultPage() {
  const router = useRouter();
  const [resultData, setResultData] = useState<SurveyResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get survey result from sessionStorage
    const storedResult = sessionStorage.getItem("surveyResult");
    if (storedResult) {
      try {
        const data = JSON.parse(storedResult);
        setResultData(data);
      } catch (error) {
        console.error("Error parsing survey result:", error);
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
    setIsLoading(false);
  }, [router]);

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Data hasil tidak ditemukan.</p>
          <Button onClick={handleBackToDashboard} className="mt-4">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Ke Halaman Dashboard
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Laporan Navigator
          </h1>
        </div>

        {/* Main Result Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Hai Marsha Bilqis,
          </h2>
          <p className="text-gray-600 mb-4">Analisis kompasnya selesai!</p>
          <p className="text-gray-600 mb-8">
            Berdasarkan jawabanmu, kami melihat profil seorang:
          </p>

          {/* Character Image Placeholder */}
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-200 to-orange-400 rounded-full flex items-center justify-center">
            <div className="text-4xl">🦊</div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {resultData.archetype.name}
          </h3>
          <p className="text-gray-600 mb-6">
            {resultData.summary["Kompas Nilai"]}{" "}
            {resultData.summary["Peralatan Andalan"]}.
          </p>
        </div>

        {/* Profile Details */}
        <div className="bg-indigo-100 rounded-2xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-indigo-800 mb-4">
            Profil Campuran Terdeteksi!
          </h4>
          <p className="text-indigo-700 mb-4">
            Kamu juga menunjukkan sifat-sifat kuat:
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-semibold text-indigo-800">The Strategist</h5>
              <p className="text-sm text-indigo-600">
                Ini berarti Kamu memiliki banyak kekuatan - kombinasi yang
                hebat!
              </p>
            </div>
            <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center">
              <div className="text-2xl">🦊</div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Kompas Nilai */}
          <div className="bg-yellow-100 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">
              Kompas Nilai
            </h4>
            <p className="text-yellow-700 mb-4">
              {resultData.summary["Kompas Nilai"]}
            </p>
            <div className="flex justify-between items-center">
              <div>
                <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                  Memiliki Impian
                </span>
                <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                  Memerintah
                </span>
                <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Kreatif
                </span>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <div className="text-xl">👑</div>
              </div>
            </div>
          </div>

          {/* Peralatan Andalan */}
          <div className="bg-teal-100 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-teal-800 mb-2">
              Peralatan Andalan:
            </h4>
            <p className="text-teal-700 mb-4">
              {resultData.summary["Peralatan Andalan"]}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-teal-600">
                Skill kreatif dari kemelintikan.
              </span>
              <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center">
                <div className="text-xl">⚡</div>
              </div>
            </div>
          </div>
        </div>

        {/* Medan Ideal */}
        <div className="bg-pink-100 rounded-2xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-pink-800 mb-2">
            Medan Ideal
          </h4>
          <p className="text-pink-700 mb-4">
            {resultData.summary["Medan Ideal"]}
          </p>
        </div>

        {/* Potensi Jalur Karier */}
        <div className="bg-cyan-100 rounded-2xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-cyan-800 mb-4">
            Potensi Jalur Karier:
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <span className="bg-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Seni
              </span>
              <span className="bg-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Graphic Designer
              </span>
              <span className="bg-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                UX/UI
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                P&D
              </span>
              <span className="bg-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Marketing
              </span>
              <span className="bg-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Peneliti
              </span>
            </div>
          </div>
          <p className="text-sm text-cyan-700 mt-4">Pemrograman Kreatif</p>
        </div>

        {/* Personal Message */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-purple-800 mb-2">
            Pesan Pribadi Kamu:
          </h4>
          <p className="text-purple-700">{resultData.description}</p>
        </div>

        {/* Mission Challenge */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            {resultData.mission_challenge.title}
          </h4>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">
                Misi 1: Jelajahi Jalur
              </h5>
              <p className="text-blue-700">
                {resultData.mission_challenge.mission_1}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">
                Misi 2: Coba Praktik
              </h5>
              <p className="text-green-700">
                {resultData.mission_challenge.mission_2}
              </p>
            </div>
          </div>
        </div>

        {/* Final Note */}
        <div className="text-center mb-8">
          <p className="text-gray-600 italic">{resultData.note}</p>
        </div>

        {/* Footer Button */}
        <div className="text-center">
          <Button
            onClick={handleBackToDashboard}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full"
          >
            Ke Dashboard →
          </Button>
        </div>
      </div>
    </div>
  );
}
