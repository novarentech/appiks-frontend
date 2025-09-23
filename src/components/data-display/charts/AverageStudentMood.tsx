
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
import { getDashboardMoodTrends } from "@/lib/api";

// Fungsi untuk mengubah data dari API menjadi format yang sesuai untuk chart
const transformApiDataToChartFormat = (apiData: Record<string, { status: string; total: number }>) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Hanya kembalikan data untuk bulan yang memiliki data dari API
  const monthData = monthNames.reduce((acc, month) => {
    const monthKey = Object.keys(apiData).find(key =>
      key.toLowerCase().includes(month.toLowerCase())
    );
    
    if (monthKey && apiData[monthKey]) {
      const { status, total } = apiData[monthKey];
      
      // Konversi status menjadi nilai numerik untuk chart
      let moodValue = 0;
      let moodName = "";
      
      // Berdasarkan status, tentukan nilai mood
      switch (status.toLowerCase()) {
        case "happy":
        case "gembira":
          moodValue = 4;
          moodName = "Gembira";
          break;
        case "neutral":
        case "netral":
          moodValue = 3;
          moodName = "Netral";
          break;
        case "sad":
        case "sedih":
          moodValue = 2;
          moodName = "Sedih";
          break;
        case "angry":
        case "marah":
          moodValue = 1;
          moodName = "Marah";
          break;
        default:
          moodValue = 0; 
          moodName = "tidak diketahui";
      }
      
      acc.push({
        month,
        moodValue,
        moodName,
        total,
        details: `${month}: Status mood rata-rata adalah ${status} (${moodValue}) dengan total ${total}.`,
      });
    }
    
    return acc;
  }, [] as Array<{
    month: string;
    moodValue: number;
    moodName: string;
    total: number;
    details: string;
  }>);
  
  return monthData;
};

// Types
interface MoodData {
  month: string;
  moodValue: number;
  moodName: string;
  total: number;
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
    const moodData = payload[0].payload;
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{`${label}`}</p>
        <p className="text-sm text-gray-500">{`Total: ${moodData.total}`}</p>
      </div>
    );
  }
  return null;
};

export default function AverageStudentMood() {
  const [selectedPoint, setSelectedPoint] = useState<MoodData | null>(null);
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await getDashboardMoodTrends();
        if (response.success && response.data) {
          const chartData = transformApiDataToChartFormat(response.data);
          setMoodData(chartData);
        }
      } catch (error) {
        console.error("Error fetching mood trends data:", error);
        // Set default data if API fails
        const defaultData = transformApiDataToChartFormat({});
        setMoodData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

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
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Memuat data mood siswa...</p>
              </div>
            ) : moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

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
                      const labels = ["", "Marah", "Sedih", "Netral", "Gembira"];
                      return labels[value] || "";
                    }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Line
                    type="linear"
                    dataKey="moodValue"
                    stroke="#6366F1"
                    strokeWidth={2}
                    connectNulls={false} // Jangan hubungkan titik null
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Tidak ada data mood tersedia.</p>
              </div>
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
                  <div className="mt-3">
                    <div className="text-sm">
                      <span className={`${
                        selectedPoint.moodName === 'Gembira' ? 'text-green-600' :
                        selectedPoint.moodName === 'Netral' ? 'text-gray-600' :
                        selectedPoint.moodName === 'Marah' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        Mood Terbanyak: {selectedPoint.moodName} ({selectedPoint.moodValue})
                      </span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-600">
                        Total: {selectedPoint.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
