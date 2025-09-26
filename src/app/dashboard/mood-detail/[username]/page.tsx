"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMoodPattern } from "@/lib/api";
import { MoodItem, MoodPatternResponse } from "@/types/api";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom Tooltip component for the chart
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      moodLabel: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="font-medium">{data.date}</p>
        <p className="text-sm">Mood: {data.moodLabel}</p>
      </div>
    );
  }
  return null;
};

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

  // Transform mood data for chart
  const getCurrentData = () => {
    if (!moodData?.data.moods) return [];

    return moodData.data.moods.map((mood: MoodItem) => {
      let moodValue = 0;
      let moodLabel = "";

      switch (mood.status) {
        case "sad":
          moodValue = 1;
          moodLabel = "Sedih";
          break;
        case "angry":
          moodValue = 2;
          moodLabel = "Marah";
          break;
        case "neutral":
          moodValue = 3;
          moodLabel = "Netral";
          break;
        case "happy":
          moodValue = 4;
          moodLabel = "Gembira";
          break;
        default:
          moodValue = 3;
          moodLabel = "Netral";
      }

      return {
        date: new Date(mood.recorded).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        mood: moodValue,
        moodLabel,
        originalDate: mood.recorded,
      };
    });
  };

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
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <CardTitle className="text-xl md:text-2xl font-semibold">
            Lihat Pola Mood {studentName}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Laporan Pola Mood</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 hari terakhir</SelectItem>
              <SelectItem value="30">30 hari terakhir</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="space-y-6">
          {/* Mood Chart */}
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getCurrentData()}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  domain={[0.5, 4.5]}
                  tickFormatter={(value) => {
                    if (value === 1) return "Sedih";
                    if (value === 2) return "Marah";
                    if (value === 3) return "Netral";
                    if (value === 4) return "Gembira";
                    return "";
                  }}
                  ticks={[1, 2, 3, 4]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="linear"
                  dataKey="mood"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#4f46e5",
                    strokeWidth: 2,
                    stroke: "#ffffff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Current Period Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD GEMBIRA</div>
              <div className="text-2xl font-bold text-green-600">
                {currentMoodStats.happy}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD NETRAL</div>
              <div className="text-2xl font-bold text-gray-600">
                {currentMoodStats.neutral}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD MARAH</div>
              <div className="text-2xl font-bold text-red-600">
                {currentMoodStats.angry}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD SEDIH</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentMoodStats.sad}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-700 mb-2.5">
              MOOD RATA-RATA{" "}
              {selectedPeriod === "7" ? "MINGGU INI" : "BULAN INI"}
            </p>
            <p
              className={`ml-2 flex items-center justify-center space-x-2 ${
                moodAnalysis.trend === "tidak aman"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-xs inline-block mr-2 ${
                  moodAnalysis.trend === "tidak aman"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              ></span>
              <span>
                &ldquo;
                {moodAnalysis.trend === "tidak aman" ? "Tidak Aman" : "Aman"}
                &rdquo;
              </span>
            </p>
          </div>

          {/* Analysis */}
          <div
            className={`border rounded-lg p-4 ${
              moodAnalysis.trend === "tidak aman"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <p
              className={`text-sm leading-relaxed text-center ${
                moodAnalysis.trend === "tidak aman"
                  ? "text-red-700"
                  : "text-green-700"
              }`}
            >
              {moodAnalysis.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
