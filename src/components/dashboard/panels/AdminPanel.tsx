"use client";

import { Users, CalendarArrowUp, Newspaper } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { useEffect, useState } from "react";
import { getDashboardAdmin } from "@/lib/api";

export default function AdminPanel() {
  const [stats, setStats] = useState([
    {
      icon: Users,
      label: "TOTAL PENGGUNA",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: Newspaper,
      label: "TOTAL KONTEN",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: CalendarArrowUp,
      label: "KONTEN HARI INI",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getDashboardAdmin();
        if (response.success) {
          const { users_count, content_count, content_today_count } =
            response.data;

          setStats([
            {
              icon: Users,
              label: "TOTAL PENGGUNA",
              value: users_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Newspaper,
              label: "TOTAL KONTEN",
              value: content_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: CalendarArrowUp,
              label: "KONTEN HARI INI",
              value: content_today_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      }
    };

    fetchAdminData();
  }, []);

  return <DashboardPanel items={stats} />;
}
