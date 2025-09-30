"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { MoodItem } from "@/types/api";

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

interface MoodChartProps {
  title: string;
  subtitle: string;
  selectedPeriod: string;
  moodData: MoodItem[];
  currentMoodStats: {
    sad: number;
    neutral: number;
    angry: number;
    happy: number;
  };
  moodAnalysis: {
    trend: string;
    description: string;
  };
  onPeriodChange: (period: string) => void;
  showDownloadButton?: boolean;
  onDownload?: () => void;
}

export default function MoodChart({
  title,
  subtitle,
  selectedPeriod,
  moodData,
  currentMoodStats,
  moodAnalysis,
  onPeriodChange,
  showDownloadButton = false,
  onDownload,
}: MoodChartProps) {
  // Transform mood data for chart
  const getCurrentData = () => {
    if (!moodData) return [];

    return moodData.map((mood: MoodItem) => {
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
          moodValue = 0;
          moodLabel = "Tidak ada data";
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

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <CardTitle className="text-xl md:text-2xl font-semibold">
            {title}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 hari terakhir</SelectItem>
              <SelectItem value="30">30 hari terakhir</SelectItem>
            </SelectContent>
          </Select>
          {showDownloadButton && onDownload && (
            <Button onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          )}
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
                {currentMoodStats.happy || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD NETRAL</div>
              <div className="text-2xl font-bold text-gray-600">
                {currentMoodStats.neutral || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD MARAH</div>
              <div className="text-2xl font-bold text-red-600">
                {currentMoodStats.angry || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">MOOD SEDIH</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentMoodStats.sad || 0}
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
