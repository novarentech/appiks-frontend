"use client";

import CounfidenceAndCounceling from "../data-display/charts/CounfidenceAndCounceling";
import DailyMoodReport from "../data-display/charts/DailyMoodReport";
import HeadTeacherPanel from "./panels/HeadTeacherPanel";

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
