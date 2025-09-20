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

// Data untuk chart Curhat & Konseling sepanjang tahun 2025
const curhatKonselingData = [
  {
    month: "Jan",
    Curhat: 15,
    Konseling: 10,
    details:
      "Januari: Awal tahun dengan aktivitas curhat dan konseling yang stabil.",
  },
  {
    month: "Feb",
    Curhat: 25,
    Konseling: 18,
    details: "Februari: Peningkatan aktivitas setelah adaptasi semester baru.",
  },
  {
    month: "Mar",
    Curhat: 40,
    Konseling: 55,
    details: "Maret: Lonjakan signifikan aktivitas konseling siswa.",
  },
  {
    month: "Apr",
    Curhat: 55,
    Konseling: 45,
    details:
      "April: Aktivitas curhat mencapai puncak, konseling sedikit menurun.",
  },
  {
    month: "May",
    Curhat: 85,
    Konseling: 110,
    details: "Mei: Puncak aktivitas karena tekanan ujian tengah semester.",
  },
  {
    month: "Jun",
    Curhat: 75,
    Konseling: 85,
    details: "Juni: Aktivitas masih tinggi menjelang ujian akhir semester.",
  },
  {
    month: "Jul",
    Curhat: 70,
    Konseling: 90,
    details:
      "Juli: Konseling lebih aktif untuk persiapan liburan dan evaluasi.",
  },
  {
    month: "Aug",
    Curhat: 95,
    Konseling: 70,
    details:
      "Agustus: Banyak curhat karena kecemasan menghadapi semester baru.",
  },
  {
    month: "Sep",
    Curhat: 65,
    Konseling: 50,
    details: "September: Aktivitas menurun setelah adaptasi semester baru.",
  },
  {
    month: "Oct",
    Curhat: 50,
    Konseling: 40,
    details: "Oktober: Kondisi lebih stabil, aktivitas kembali normal.",
  },
  {
    month: "Nov",
    Curhat: 45,
    Konseling: 35,
    details: "November: Aktivitas menurun menjelang akhir tahun.",
  },
  {
    month: "Dec",
    Curhat: 35,
    Konseling: 25,
    details: "Desember: Aktivitas rendah karena fokus pada liburan.",
  },
];

// Types
interface CurhatKonselingData {
  month: string;
  Curhat: number;
  Konseling: number;
  details: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: CurhatKonselingData;
  }>;
  label?: string;
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const curhatData = payload.find((p) => p.dataKey === "Curhat");
    const konselingData = payload.find((p) => p.dataKey === "Konseling");

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        {curhatData && (
          <p className="text-indigo-600">{`Curhat: ${curhatData.value}`}</p>
        )}
        {konselingData && (
          <p className="text-teal-600">{`Konseling: ${konselingData.value}`}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function CounfidenceAndCounceling() {
  const [selectedPoint, setSelectedPoint] =
    useState<CurhatKonselingData | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  return (
    <>
      {/* Chart Laporan Curhat & Konseling 2025 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Laporan Curhat & Konseling 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curhatKonselingData} onClick={handleChartClick}>
                {/* Horizontal dotted grid lines */}
                <ReferenceLine y={50} stroke="#d1d5db" strokeDasharray="2 2" />
                <ReferenceLine y={100} stroke="#d1d5db" strokeDasharray="2 2" />
                <ReferenceLine y={150} stroke="#d1d5db" strokeDasharray="2 2" />
                <ReferenceLine y={200} stroke="#d1d5db" strokeDasharray="2 2" />

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
                  domain={[0, 200]}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="linear"
                  dataKey="Curhat"
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
                <Line
                  type="linear"
                  dataKey="Konseling"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{
                    fill: "#10B981",
                    strokeWidth: 2,
                    r: 3,
                    cursor: "pointer",
                  }}
                  activeDot={{ r: 5, stroke: "#10B981", strokeWidth: 2 }}
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
                      <span className="text-indigo-600">
                        Curhat: {selectedPoint.Curhat}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-green-600">
                        Konseling: {selectedPoint.Konseling}
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
