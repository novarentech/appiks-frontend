"use client";

import { useState, useEffect } from "react";
import { University, ShieldUserIcon } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { getDashboardSuper } from "@/lib/api";

export default function TuPanel() {
  const [stats, setStats] = useState([
    {
      icon: University,
      label: "TOTAL SEKOLAH",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: ShieldUserIcon,
      label: "TOTAL TU",
      value: 0,
       bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardSuper();
        if (response.success) {
          setStats([
            {
              icon: University,
              label: "TOTAL SEKOLAH",
              value: response.data.school_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: ShieldUserIcon,
              label: "TOTAL TU",
              value: response.data.admin_count,
               bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard super data:", error);
      }
    };

    fetchData();
  }, []);

  return <DashboardPanel items={stats} />;
}
