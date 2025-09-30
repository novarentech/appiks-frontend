"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getMoodPattern } from "@/lib/api";
import { MoodPatternResponse } from "@/types/api";
import MoodChart from "@/components/dashboard/MoodChart";

export default function MoodDetailPage() {
  const params = useParams();
  const username = params.username as string;

  const [selectedPeriod, setSelectedPeriod] = useState<string>("7");
  const [moodData, setMoodData] = useState<MoodPatternResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch mood pattern data
  const fetchMoodData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const type = selectedPeriod === "7" ? "weekly" : "monthly";
      const response = await getMoodPattern(username, type);
      setMoodData(response);
    } catch (err) {
      setError("Gagal memuat data mood. Silakan coba lagi.");
      console.error("Error fetching mood data:", err);
    } finally {
      setLoading(false);
    }
  }, [username, selectedPeriod]);

  // Fetch data when component mounts or when period changes
  useEffect(() => {
    if (username) {
      fetchMoodData();
    }
  }, [username, selectedPeriod, fetchMoodData]);


  // Get current mood stats
  const currentMoodStats = moodData?.data.recap || {
    sad: 0,
    neutral: 0,
    angry: 0,
    happy: 0,
  };

  // Get student name
  const studentName = moodData?.data.user.name || "Siswa";

  // Mood analysis based on mean
  const getMoodAnalysis = () => {
    const mean = moodData?.data.mean || "neutral";

    if (mean === "insecure" || mean === "sad" || mean === "angry") {
      return {
        trend: "tidak aman",
        description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori tidak aman dalam ${
          selectedPeriod === "7" ? "7 hari" : "30 hari"
        } terakhir. Hal ini dapat menjadi tanda bahwa siswa sedang mengalami tekanan emosional atau perasaan negatif yang cukup serius. Disarankan untuk menghubungi siswa secara personal, menawarkan sesi konseling secara private, atau memantau perubahan mood di minggu berikutnya.`,
      };
    } else {
      return {
        trend: "aman",
        description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori aman dalam ${
          selectedPeriod === "7" ? "7 hari" : "30 hari"
        } terakhir. Hal ini menunjukkan bahwa siswa memiliki kondisi emosional yang stabil. Tetap pantau perkembangan mood siswa untuk memastikan kondisinya tetap baik.`,
      };
    }
  };

  const moodAnalysis = getMoodAnalysis();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data mood...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMoodData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <MoodChart
      title={`Lihat Pola Mood ${studentName}`}
      subtitle="Laporan Pola Mood"
      selectedPeriod={selectedPeriod}
      moodData={moodData?.data.moods || []}
      currentMoodStats={currentMoodStats}
      moodAnalysis={moodAnalysis}
      onPeriodChange={setSelectedPeriod}
      showDownloadButton={true}
    />
  );
}
