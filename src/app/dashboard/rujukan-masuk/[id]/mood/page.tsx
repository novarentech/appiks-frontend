"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPsychologistMoodRecap } from "@/lib/api";
import MoodChart from "@/components/dashboard/MoodChart";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MoodDetailPage() {
  return (
    <RoleGuard permissionType="rujukan-masuk">
      <MoodDetailPageContent />
    </RoleGuard>
  );
}

function MoodDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [moodData, setMoodData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoodData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPsychologistMoodRecap(id);
      if (response.success && response.data) {
        setMoodData(response.data);
      } else {
        setError(response.message || "Gagal memuat data mood. Silakan coba lagi.");
        toast.error(response.message || "Gagal memuat data mood");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data.");
      console.error(err);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchMoodData();
    }
  }, [id, fetchMoodData]);

  const currentMoodStats = moodData?.recap || {
    sad: 0,
    neutral: 0,
    angry: 0,
    happy: 0,
  };

  const studentName = moodData?.student?.name || "Siswa";

  const getMoodAnalysis = () => {
    const mean = moodData?.mean || "neutral";

    if (mean === "insecure" || mean === "sad" || mean === "angry") {
      return {
        trend: "tidak aman",
        description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori tidak aman dalam periode terakhir. Hal ini dapat menjadi tanda bahwa siswa sedang mengalami tekanan emosional atau perasaan negatif yang cukup sering. Disarankan untuk menghubungi siswa secara personal, menawarkan sesi konseling secara private, atau memantau perubahan mood di minggu berikutnya.`,
      };
    } else {
      return {
        trend: "aman",
        description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori aman dalam periode terakhir. Hal ini menunjukkan bahwa siswa memiliki kondisi emosional yang stabil. Tetap pantau perkembangan mood siswa untuk memastikan kondisinya tetap baik.`,
      };
    }
  };

  const moodAnalysis = getMoodAnalysis();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Memuat data mood...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchMoodData}>Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      <MoodChart
        title={`Lihat Pola Mood ${studentName}`}
        subtitle="Laporan Pola Mood"
        selectedPeriod="30"
        moodData={moodData?.moods || []}
        currentMoodStats={currentMoodStats}
        moodAnalysis={moodAnalysis}
        onPeriodChange={() => {}}
        showDownloadButton={false}
        hidePeriodSelector={true}
      />
    </div>
  );
}
