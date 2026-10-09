"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import CounfidenceAndCounceling from "../data-display/charts/CounfidenceAndCounceling";
import DailyMoodReport from "../data-display/charts/DailyMoodReport";
import HeadTeacherPanel from "./panels/HeadTeacherPanel";
import { DashboardHeader } from "./DashboardHeader";
import { getHeadTeacherDashboardStats } from "@/lib/api";

export function HeadTeacherDashboard() {
  const [stats, setStats] = useState<{need_intention: number; resolved_interventions: number} | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getHeadTeacherDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const total = (stats?.need_intention || 0) + (stats?.resolved_interventions || 0);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Selamat Datang"
        subtitle="Kelola akun pengguna Apppiks"
      />

      {stats && total > 0 && (
        <div className="border border-red-200 bg-red-50 rounded-xl p-4 md:p-6">
          <div className="flex gap-3">
            <AlertTriangle className="text-red-500 w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 w-full">
              <h3 className="text-red-700 font-semibold text-lg">
                Insiden Darurat Aktif ({total})
              </h3>
              <p className="text-red-600 text-sm">
                Ada {total} Kasus Kritis/Red Zone yang membutuhkan perhatian.
              </p>
              <ul className="text-red-500 text-sm space-y-1 mt-2">
                <li>• {stats.need_intention} Belum Ditangani</li>
                <li>• {stats.resolved_interventions} Sedang Ditangani</li>
              </ul>
              <div className="pt-2">
                <Link 
                  href="/dashboard/monitoring-penanganan" 
                  className="inline-flex items-center text-red-600 font-semibold text-sm hover:text-red-700"
                >
                  Lihat Monitoring <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <HeadTeacherPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <CounfidenceAndCounceling />
        <DailyMoodReport />
      </div>
    </div>
  );
}
