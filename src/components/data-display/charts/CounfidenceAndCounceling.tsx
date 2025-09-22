"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";
import { getDashboardReportGraph } from "@/lib/api";
import { DashboardReportGraphResponse } from "@/types/api";

// Types
interface CurhatKonselingData {
  month: string;
  Curhat: number;
  Konseling: number;
  details: string;
}

// Fungsi untuk mengubah format data dari API
const transformApiData = (
  apiData: DashboardReportGraphResponse
): CurhatKonselingData[] => {
  const { report, sharing } = apiData.data;

  // Daftar semua bulan dalam setahun
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Mendapatkan tahun dari data yang ada di API
  const allKeys = [...Object.keys(report), ...Object.keys(sharing)];
  let year = "2025"; // Default tahun
  
  if (allKeys.length > 0) {
    // Ambil tahun dari key pertama yang ditemukan
    const firstKey = allKeys[0];
    const extractedYear = firstKey.split('-')[0];
    if (extractedYear && /^\d{4}$/.test(extractedYear)) {
      year = extractedYear;
    }
  }

  // Membuat data untuk semua bulan, termasuk yang tidak ada di API
  return monthNames.map((monthName, index) => {
    // Format bulan untuk mencocokkan dengan format API (2025-01, 2025-02, dst)
    const monthKey = `${year}-${String(index + 1).padStart(2, "0")}`;

    // Membuat detail deskripsi berdasarkan data
    const reportCount = report[monthKey] || 0;
    const sharingCount = sharing[monthKey] || 0;
    const details = `${monthName}: ${reportCount} laporan, ${sharingCount} sesi berbagi.`;

    return {
      month: monthName,
      Curhat: reportCount,
      Konseling: sharingCount,
      details,
    };
  });
};

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
  const [chartData, setChartData] = useState<CurhatKonselingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<string>("2025"); // Default tahun

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const apiData: DashboardReportGraphResponse =
          await getDashboardReportGraph();

        if (apiData.success) {
          // Mendapatkan tahun dari data yang ada di API
          const { report, sharing } = apiData.data;
          const allKeys = [...Object.keys(report), ...Object.keys(sharing)];
          let extractedYear = "2025"; // Default tahun
          
          if (allKeys.length > 0) {
            // Ambil tahun dari key pertama yang ditemukan
            const firstKey = allKeys[0];
            const yearFromKey = firstKey.split('-')[0];
            if (yearFromKey && /^\d{4}$/.test(yearFromKey)) {
              extractedYear = yearFromKey;
            }
          }
          
          setYear(extractedYear);
          const transformedData = transformApiData(apiData);
          setChartData(transformedData);
        } else {
          setError(apiData.message || "Gagal mengambil data");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data");
        console.error("Error fetching chart data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
            Laporan Curhat & Konseling {year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Memuat data...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} onClick={handleChartClick}>
                  <CartesianGrid  strokeDasharray="3 3" vertical={false} />

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
            )}
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
