"use client";

import CounfidenceAndCounceling from "../data-display/charts/CounfidenceAndCounceling";
import DailyMoodReport from "../data-display/charts/DailyMoodReport";
import HeadTeacherPanel from "./panels/HeadTeacherPanel";
import { DashboardHeader } from "./DashboardHeader";

export function HeadTeacherDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Selamat Datang"
        subtitle="Kelola akun pengguna Apppiks"
      />

      <HeadTeacherPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <CounfidenceAndCounceling />
        <DailyMoodReport />
      </div>
    </div>
  );
}
