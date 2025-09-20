"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Data untuk chart mood hari ini
const todayMoodData = [
  {
    name: "Siswa merasa senang dan bersemangat.",
    value: 70,
    color: "#10b981", // green - Gembira
  },
  {
    name: "Siswa dalam kondisi biasa",
    value: 10,
    color: "#374151", // gray - Netral
  },
  {
    name: "Siswa sedang mengalami masalah.",
    value: 50,
    color: "#3b82f6", // blue - Sedih
  },
  {
    name: "Siswa sedang dalam kondisi emosi tinggi",
    value: 20,
    color: "#ef4444", // red - Marah
  },
];

export default function DailyMoodReport() {
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
            <div className="bg-green-500" style={{ width: "46.7%" }}></div>
            <div className="bg-gray-800" style={{ width: "6.7%" }}></div>
            <div className="bg-blue-500" style={{ width: "33.3%" }}></div>
            <div className="bg-red-500" style={{ width: "13.3%" }}></div>
          </div>
        </div>

        {/* Keterangan */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-4">
            Keterangan :
          </h4>
          <div className="space-y-3">
            {todayMoodData.map((item, index) => (
              <div
            key={index}
            className={`flex items-center justify-between ${
              index !== todayMoodData.length - 1 ? "border-b border-gray-200 pb-3" : ""
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
