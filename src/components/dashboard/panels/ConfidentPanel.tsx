"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCheck, Sigma } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { getDashboardSharingCount } from "@/lib/api";

export default function ConfidentPanel() {
  const [stats, setStats] = useState([
    {
      icon: Clock,
      label: "BELUM DIBALAS",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: CheckCheck,
      label: "DIBALAS",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: Sigma,
      label: "TOTAL",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardSharingCount();
        if (response.success) {
          // Calculate "BELUM DIBALAS" by subtracting replied from received
          const received = parseInt(response.data.received) || 0;
          const replied = parseInt(response.data.replied) || 0;
          const total = parseInt(response.data.total) || 0;
          
          setStats([
            {
              icon: Clock,
              label: "BELUM DIBALAS",
              value: received,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: CheckCheck,
              label: "DIBALAS",
              value: replied,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Sigma,
              label: "TOTAL",
              value: total,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard sharing count data:", error);
      }
    };

    fetchData();
  }, []);

  return <DashboardPanel items={stats} />;
}
