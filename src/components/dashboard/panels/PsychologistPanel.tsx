import { CalendarClock, CalendarCheck, CheckCircle } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { useEffect, useState } from "react";
import { mockPsychologistStats } from "@/lib/mockPsychologistData";

export default function PsychologistPanel() {
  const [stats, setStats] = useState([
    {
      icon: CalendarClock,
      label: "MENUNGGU KONFIRMASI",
      value: 0,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500",
    },
    {
      icon: CalendarCheck,
      label: "JADWAL TERKONFIRMASI",
      value: 0,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500",
    },
    {
      icon: CheckCircle,
      label: "KASUS SELESAI",
      value: 0,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we use mock data
    const fetchStats = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStats([
        {
          icon: CalendarClock,
          label: "MENUNGGU KONFIRMASI",
          value: mockPsychologistStats.pending_confirmation_count,
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-500",
        },
        {
          icon: CalendarCheck,
          label: "JADWAL TERKONFIRMASI",
          value: mockPsychologistStats.confirmed_schedule_count,
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-500",
        },
        {
          icon: CheckCircle,
          label: "KASUS SELESAI",
          value: mockPsychologistStats.completed_case_count,
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-500",
        },
      ]);
    };

    fetchStats();
  }, []);

  // Using gridCols="grid-cols-1 md:grid-cols-3" since there are exactly 3 items
  return <DashboardPanel items={stats} gridCols="grid-cols-1 md:grid-cols-3" />;
}
