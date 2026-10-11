"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  ClipboardCheck,
  CheckCheck,
  Ban,
} from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { getDashboardReportCount, getReportList } from "@/lib/api";

export default function CounselingSchedulePanel() {
  const [stats, setStats] = useState([
    {
      icon: Clock,
      label: "MENUNGGU",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: CheckCheck,
      label: "SELESAI",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: Ban,
      label: "DIBATALKAN / DITOLAK",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: ClipboardCheck,
      label: "DIJADWALKAN",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countResponse, reportResponse] = await Promise.all([
          getDashboardReportCount().catch(() => null),
          getReportList().catch(() => null),
        ]);

        let menunggu = 0;
        let selesai = 0;
        let dibatalkan = 0;
        let dijadwalkan = 0;

        // Cek apakah countResponse memiliki data
        if (
          countResponse?.success &&
          countResponse?.data &&
          (countResponse.data.menunggu > 0 ||
            countResponse.data.selesai > 0 ||
            countResponse.data.dijadwalkan > 0 ||
            countResponse.data.dibatalkan > 0)
        ) {
          menunggu = countResponse.data.menunggu;
          selesai = countResponse.data.selesai;
          dibatalkan = countResponse.data.dibatalkan;
          dijadwalkan = countResponse.data.dijadwalkan;
        } else if (reportResponse?.success && Array.isArray(reportResponse?.data)) {
          // Fallback kalkulasi lokal berdasarkan 9 enum ReportStatus terbaru
          reportResponse.data.forEach((item: any) => {
            const st = (item.status || "").toLowerCase();
            if (
              [
                "belum ditinjau",
                "sedang ditangani",
                "belum ditanggapi",
                "menunggu persetujuan siswa",
                "bukan urgent",
                "menunggu",
              ].includes(st)
            ) {
              menunggu++;
            } else if (
              ["konseling dijadwalkan", "dijadwalkan", "disetujui"].includes(st)
            ) {
              dijadwalkan++;
            } else if (["diselesaikan", "selesai"].includes(st)) {
              selesai++;
            } else if (
              [
                "dibatalkan",
                "jadwal ditolak siswa",
                "ditolak oleh siswa",
                "ditolak",
              ].includes(st)
            ) {
              dibatalkan++;
            }
          });
        }

        setStats([
          {
            icon: Clock,
            label: "MENUNGGU",
            value: menunggu,
            bgColor: "bg-indigo-200",
            textColor: "text-indigo-500",
          },
          {
            icon: CheckCheck,
            label: "SELESAI",
            value: selesai,
            bgColor: "bg-indigo-200",
            textColor: "text-indigo-500",
          },
          {
            icon: Ban,
            label: "DIBATALKAN / DITOLAK",
            value: dibatalkan,
            bgColor: "bg-indigo-200",
            textColor: "text-indigo-500",
          },
          {
            icon: ClipboardCheck,
            label: "DIJADWALKAN",
            value: dijadwalkan,
            bgColor: "bg-indigo-200",
            textColor: "text-indigo-500",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard report count data:", error);
      }
    };

    fetchData();
  }, []);

  return <DashboardPanel items={stats} gridCols="grid-cols-1 md:grid-cols-3 lg:grid-cols-4" />;
}
