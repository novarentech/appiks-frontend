"use client";

import AverageStudentMood from "../data-display/charts/AverageStudentMood";
import DailyMoodReport from "../data-display/charts/DailyMoodReport";
import TeacherPanel from "./panels/TeacherPanel";
import { DashboardHeader } from "./DashboardHeader";

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Selamat Datang" subtitle="Pantau mood siswa, interaksi, dan laporan dengan mudah." />

      <TeacherPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <AverageStudentMood />
        <DailyMoodReport />
      </div>
    </div>
  );
}
