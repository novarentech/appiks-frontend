"use client";

import AdminPanel from "./panels/AdminPanel";
import NewContentCard from "../data-display/cards/NewContent";
import NewUserCard from "../data-display/cards/NewUser";
import { DashboardHeader } from "./DashboardHeader";

export function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Selamat Datang"
        subtitle="Kelola Akun dan Konten dengan Mudah"
      />

      <AdminPanel />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Konten Terbaru */}
        <NewContentCard />
        {/* Pengguna Terbaru */}
        <NewUserCard />
      </div>
    </div>
  );
}
