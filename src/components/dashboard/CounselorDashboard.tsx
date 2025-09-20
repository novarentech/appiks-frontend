"use client";

import CounfidenceAndCounceling from "../data-display/charts/CounfidenceAndCounceling";
import DailyMoodReport from "../data-display/charts/DailyMoodReport";
import CouncelorPanel from "./panels/CouncelorPanel";


export function CounselorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-gray-600 mt-2">
          Pantau kondisi emosional siswa hari ini.
        </p>
      </div>

      <CouncelorPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <CounfidenceAndCounceling />
        <DailyMoodReport />
      </div>
    </div>
  );
}
