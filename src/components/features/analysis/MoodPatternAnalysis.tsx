"use client";

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
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

// Sample mood pattern data for Alex Allan
const moodPatternData7Days = [
  { date: "27 Aug", mood: 2, isToday: true },
  { date: "28 Aug", mood: 3, isToday: false },
  { date: "29 Aug", mood: 2, isToday: false },
  { date: "30 Aug", mood: 3, isToday: false },
  { date: "31 Aug", mood: 3, isToday: false },
  { date: "1 Sep", mood: 2, isToday: false },
  { date: "2 Sep", mood: 2, isToday: false },
];

const moodPatternData30Days = [
  { date: "1 Aug", mood: 2, isToday: false },
  { date: "3 Aug", mood: 2, isToday: false },
  { date: "5 Aug", mood: 3, isToday: false },
  { date: "7 Aug", mood: 4, isToday: false },
  { date: "9 Aug", mood: 2, isToday: false },
  { date: "11 Aug", mood: 3, isToday: false },
  { date: "13 Aug", mood: 2, isToday: false },
  { date: "14 Aug", mood: 2, isToday: false },
  { date: "16 Aug", mood: 3, isToday: false },
  { date: "18 Aug", mood: 4, isToday: false },
  { date: "20 Aug", mood: 3, isToday: false },
  { date: "22 Aug", mood: 2, isToday: false },
  { date: "24 Aug", mood: 2, isToday: false },
  { date: "26 Aug", mood: 4, isToday: false },
  { date: "27 Aug", mood: 2, isToday: true },
  { date: "28 Aug", mood: 3, isToday: false },
  { date: "29 Aug", mood: 2, isToday: false },
  { date: "31 Aug", mood: 3, isToday: false },
];

interface Student {
  id: number;
  name: string;
  nisn: string;
  kelas: string;
  statusMood: string;
  detailMood: string;
  aksi: string;
}

interface MoodPatternAnalysisProps {
  selectedStudent?: Student | null;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{`${label}`}</p>
        <p style={{ color: data.color }}>
          Mood:{" "}
          {data.value === 1
            ? "Sedih"
            : data.value === 2
            ? "Marah"
            : data.value === 3
            ? "Netral"
            : "Gembira"}
        </p>
      </div>
    );
  }
  return null;
};

export default function MoodPatternAnalysis({ selectedStudent }: MoodPatternAnalysisProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  // Use the selected student's name or fallback to Alex Allan
  const studentName = selectedStudent?.name || "Alex Allan";

  // Get the appropriate data based on selected period
  const getCurrentData = () => {
    return selectedPeriod === "7"
      ? moodPatternData7Days
      : moodPatternData30Days;
  };

  // Calculate mood stats based on selected period
  const getCurrentMoodStats = () => {
    const data = getCurrentData();
    const moodCounts = { gembira: 0, netral: 0, marah: 0, sedih: 0 };

    data.forEach((item) => {
      const mood = item.mood;
      if (mood >= 3.5) moodCounts.gembira++;
      else if (mood >= 2.5) moodCounts.netral++;
      else if (mood >= 1.5) moodCounts.marah++;
      else moodCounts.sedih++;
    });

    return moodCounts;
  };

  const currentMoodStats = getCurrentMoodStats();

  const moodAnalysis = {
    trend: "tidak aman",
    description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori tidak aman dalam ${
      selectedPeriod === "7" ? "7 hari" : "30 hari"
    } terakhir. Hal ini dapat menjadi tanda bahwa siswa sedang mengalami tekanan emosional atau perasaan negatif yang cukup serius. Disarankan untuk menghubungi siswa secara personal, menawarkan sesi konseling secara private, atau memantau perubahan mood di minggu berikutnya.`,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
              📄 Cetak Laporan
            </button>
          </div>
        </div>
      </CardHeader>
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
              {currentMoodStats.gembira}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">MOOD NETRAL</div>
            <div className="text-2xl font-bold text-gray-600">
              {currentMoodStats.netral}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">MOOD MARAH</div>
            <div className="text-2xl font-bold text-red-600">
              {currentMoodStats.marah}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">MOOD SEDIH</div>
            <div className="text-2xl font-bold text-blue-600">
              {currentMoodStats.sedih}
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-700 mb-2.5">
            MOOD RATA-RATA {selectedPeriod === "7" ? "MINGGU INI" : "BULAN INI"}
          </p>
          <p className="ml-2 text-red-600 flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-xs bg-red-600 inline-block mr-2"></span>
            <span>&quot;Tidak Aman&quot;</span>
          </p>
        </div>

        {/* Analysis */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 leading-relaxed text-center">
            {moodAnalysis.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
