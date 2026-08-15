"use client";

import { Calendar, CalendarClock, CheckCircle2 } from "lucide-react";
import DashboardPanel from "@/components/dashboard/panels/DashboardPanel";

export function PsychologistSchedulePanel() {
  const stats = [
    {
      icon: Calendar,
      label: "SLOT TERSEDIA",
      value: 3,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500",
    },
    {
      icon: CalendarClock,
      label: "MENUNGGU KONFIRMASI",
      value: 2,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500",
    },
    {
      icon: CheckCircle2,
      label: "TERKONFIRMASI",
      value: 3,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500",
    },
  ];

  return <DashboardPanel items={stats} gridCols="grid-cols-1 md:grid-cols-3" />;
}
