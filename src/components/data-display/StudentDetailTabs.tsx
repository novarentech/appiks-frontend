"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MessageSquare, FileText } from "lucide-react";
import MoodChart from "@/components/dashboard/MoodChart";
import StudentSharingTable from "@/components/data-display/tables/StudentSharingTable";
import StudentReportTable from "@/components/data-display/tables/StudentReportTable";
import { MoodPatternResponse } from "@/types/api";

interface StudentDetailTabsProps {
  username: string;
  studentName: string;
  selectedPeriod: string;
  moodData: MoodPatternResponse | null;
  onPeriodChange: (period: string) => void;
}

export default function StudentDetailTabs({
  username,
  studentName,
  selectedPeriod,
  moodData,
  onPeriodChange,
}: StudentDetailTabsProps) {
  // Get current mood stats
  const currentMoodStats = moodData?.data.recap || {
    sad: 0,
    neutral: 0,
    angry: 0,
    happy: 0,
  };

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

  return (
    <Tabs defaultValue="mood" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="mood" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Mood Siswa</span>
          <span className="sm:hidden">Mood</span>
        </TabsTrigger>
        <TabsTrigger value="sharing" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Riwayat Curhat</span>
          <span className="sm:hidden">Curhat</span>
        </TabsTrigger>
        <TabsTrigger value="report" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Riwayat Konseling</span>
          <span className="sm:hidden">Konseling</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mood" className="mt-6">
        <MoodChart
          title={`Lihat Pola Mood ${studentName}`}
          subtitle="Laporan Pola Mood"
          selectedPeriod={selectedPeriod}
          moodData={moodData?.data.moods || []}
          currentMoodStats={currentMoodStats}
          moodAnalysis={moodAnalysis}
          onPeriodChange={onPeriodChange}
          showDownloadButton={true}
        />
      </TabsContent>

      <TabsContent value="sharing" className="mt-6">
        <StudentSharingTable username={username} studentName={studentName} />
      </TabsContent>

      <TabsContent value="report" className="mt-6">
        <StudentReportTable username={username} studentName={studentName} />
      </TabsContent>
    </Tabs>
  );
}
