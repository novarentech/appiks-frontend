"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { useState } from "react";

// Data untuk chart line mood rata-rata sepanjang tahun
const yearlyMoodData = [
  {
    month: "Jan",
    Gembira: 3,
    Netral: 2,
    Marah: 1,
    Sedih: 2,
    details:
      "Januari: Siswa menunjukkan mood yang cukup stabil dengan mayoritas dalam kondisi gembira.",
  },
  {
    month: "Feb",
    Gembira: 2,
    Netral: 2,
    Marah: 1,
    Sedih: 2,
    details:
      "Februari: Mood siswa mulai menurun setelah liburan, banyak yang merasa sedih kembali ke sekolah.",
  },
  {
    month: "Mar",
    Gembira: 2,
    Netral: 2,
    Marah: 1,
    Sedih: 2,
    details:
      "Maret: Mood siswa masih dalam tahap penyesuaian dengan rutinitas sekolah baru.",
  },
  {
    month: "Apr",
    Gembira: 3,
    Netral: 3,
    Marah: 1,
    Sedih: 1,
    details:
      "April: Peningkatan mood positif, siswa mulai beradaptasi dengan baik.",
  },
  {
    month: "May",
    Gembira: 2,
    Netral: 2,
    Marah: 1,
    Sedih: 4,
    details: "Mei: Penurunan mood karena tekanan ujian tengah semester.",
  },
  {
    month: "Jun",
    Gembira: 4,
    Netral: 3,
    Marah: 1,
    Sedih: 2,
    details: "Juni: Mood membaik setelah ujian selesai, siswa merasa lega.",
  },
  {
    month: "Jul",
    Gembira: 3,
    Netral: 2,
    Marah: 1,
    Sedih: 2,
    details: "Juli: Liburan semester, mood siswa cenderung positif.",
  },
  {
    month: "Aug",
    Gembira: 4,
    Netral: 3,
    Marah: 2,
    Sedih: 2,
    details:
      "Agustus: Semester baru dimulai, antusiasme tinggi tapi ada juga yang merasa marah.",
  },
  {
    month: "Sep",
    Gembira: 3,
    Netral: 2,
    Marah: 1,
    Sedih: 2,
    details:
      "September: Mood mulai stabil kembali setelah adaptasi semester baru.",
  },
  {
    month: "Oct",
    Gembira: 3,
    Netral: 2,
    Marah: 1,
    Sedih: 2,
    details: "Oktober: Kondisi mood siswa dalam keadaan normal dan terkendali.",
  },
  {
    month: "Nov",
    Gembira: 3,
    Netral: 2,
    Marah: 1,
    Sedih: 2,
    details: "November: Mood siswa stabil menjelang akhir tahun.",
  },
  {
    month: "Dec",
    Gembira: 3,
    Netral: 2,
    Marah: 1,
    Sedih: 2,
    details: "Desember: Antusiasme tinggi menjelang liburan akhir tahun.",
  },
];

// Types
interface MoodData {
  month: string;
  Gembira: number;
  Netral: number;
  Marah: number;
  Sedih: number;
  details: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: MoodData;
  }>;
  label?: string;
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{`${label}`}</p>
        <p className="text-green-600">{`Gembira: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function AverageStudentMood() {
  const [selectedPoint, setSelectedPoint] = useState<MoodData | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  return (
    <>
      {/* Chart Rata-Rata Mood Siswa 2025 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Rata-Rata Mood Siswa 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyMoodData} onClick={handleChartClick}>
                {/* Horizontal dotted grid lines */}
                <ReferenceLine y={1} stroke="#d1d5db" strokeDasharray="2 2" />
                <ReferenceLine y={2} stroke="#d1d5db" strokeDasharray="2 2" />
                <ReferenceLine y={3} stroke="#d1d5db" strokeDasharray="2 2" />
                <ReferenceLine y={4} stroke="#d1d5db" strokeDasharray="2 2" />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tickFormatter={(value) => {
                    const labels = ["", "Sedih", "Marah", "Netral", "Gembira"];
                    return labels[value] || "";
                  }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="linear"
                  dataKey="Gembira"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{
                    fill: "#6366F1",
                    strokeWidth: 2,
                    r: 3,
                    cursor: "pointer",
                  }}
                  activeDot={{ r: 5, stroke: "#6366F1", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Detail Information when point is clicked */}
          {selectedPoint && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Detail {selectedPoint.month}
                  </h4>
                  <p className="text-sm text-gray-700 mt-2">
                    {selectedPoint.details}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="text-sm">
                      <span className="text-green-600">
                        Gembira: {selectedPoint.Gembira}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">
                        Netral: {selectedPoint.Netral}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-red-600">
                        Marah: {selectedPoint.Marah}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-blue-600">
                        Sedih: {selectedPoint.Sedih}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
