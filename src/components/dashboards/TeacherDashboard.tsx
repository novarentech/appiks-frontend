"use client";

import TeacherPanel from "../components/panel/teacher-panel";
import AverageStudentMood from "../components/chart/AverageStudentMood";
import DailyMoodReport from "../components/chart/DailyMoodReport";

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
