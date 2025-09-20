"use client";

import AverageStudentMood from "../data-display/charts/AverageStudentMood";
import DailyMoodReport from "../data-display/charts/DailyMoodReport";
import TeacherPanel from "./panels/TeacherPanel";


export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-gray-600 mt-2">
          Pantau mood siswa, interaksi, dan laporan dengan mudah.
        </p>
      </div>

      <TeacherPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <AverageStudentMood />
        <DailyMoodReport />
      </div>
    </div>
  );
}
