"use client";

import TuPanel from "./panels/TuPanel";
import AverageStudentMood from "../data-display/charts/AverageStudentMood";
import { DashboardHeader } from "./DashboardHeader";

export function SuperDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Selamat Datang"
        subtitle="Kendali Penuh Appiks"
      />

      <TuPanel />
      <AverageStudentMood />
    </div>
  );
}
