"use client";

import CounfidenceAndCounceling from "../data-display/charts/CounfidenceAndCounceling";
import DailyMoodReport from "../data-display/charts/DailyMoodReport";
import CouncelorPanel from "./panels/CouncelorPanel";
import { DashboardHeader } from "./DashboardHeader";

export function CounselorDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Selamat Datang"
        subtitle="Pantau kondisi emosional siswa hari ini."
      />

      <CouncelorPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <CounfidenceAndCounceling />
        <DailyMoodReport />
      </div>
    </div>
  );
}
