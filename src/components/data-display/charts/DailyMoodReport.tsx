"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardMoodGraph } from "@/lib/api";
import { DashboardMoodGraphResponse } from "@/types/api";

// Data untuk chart mood hari ini
const moodDataConfig = [
  {
    key: "happy",
    name: "Siswa merasa senang dan bersemangat.",
    color: "#10b981", // green - Gembira
  },
  {
    key: "neutral",
    name: "Siswa dalam kondisi biasa",
    color: "#374151", // gray - Netral
  },
  {
    key: "sad",
    name: "Siswa sedang mengalami masalah.",
    color: "#3b82f6", // blue - Sedih
  },
  {
    key: "angry",
    name: "Siswa sedang dalam kondisi emosi tinggi",
    color: "#ef4444", // red - Marah
  },
];

export default function DailyMoodReport() {
  const [moodData, setMoodData] = useState<DashboardMoodGraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardMoodGraph();
        setMoodData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch mood data");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  // Transform API data to chart format
  const getChartData = () => {
    if (!moodData) return [];
    
    const total = Object.values(moodData.data).reduce((sum, count) => sum + count, 0);
    
    return moodDataConfig.map(config => ({
      ...config,
      value: moodData.data[config.key as keyof typeof moodData.data],
      percentage: total > 0 ? (moodData.data[config.key as keyof typeof moodData.data] / total) * 100 : 0
    }));
  };

  const chartData = getChartData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Laporan Mood Siswa Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Laporan Mood Siswa Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">
          Laporan Mood Siswa Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Color Legend */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500"></div>
              <span className="text-sm text-gray-600">Gembira</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-800"></div>
              <span className="text-sm text-gray-600">Netral</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500"></div>
              <span className="text-sm text-gray-600">Sedih</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500"></div>
              <span className="text-sm text-gray-600">Marah</span>
            </div>
          </div>

          {/* Horizontal bars representation */}
          <div className="flex h-6 rounded overflow-hidden">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="h-full"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Keterangan */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-4">
            Keterangan :
          </h4>
          <div className="space-y-3">
            {chartData.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between ${
                  index !== chartData.length - 1 ? "border-b border-gray-200 pb-3" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
