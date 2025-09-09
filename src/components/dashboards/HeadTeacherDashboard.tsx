"use client";

import CounfidenceAndCounceling from "../components/chart/CounfidenceAndCounceling";
import DailyMoodReport from "../components/chart/DailyMoodReport";
import HeadTeacherPanel from "../components/panel/headTeacherPanel";

export function HeadTeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-gray-600 mt-2">Kelola akun pengguna Apppiks</p>
      </div>

      <HeadTeacherPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <CounfidenceAndCounceling />
        <DailyMoodReport />
      </div>
    </div>
  );
}
