import { CalendarClock, CalendarCheck, CheckCircle } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { useEffect, useState } from "react";
import { getReferralOverview } from "@/lib/api";

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
    const fetchStats = async () => {
      try {
        const response = await getReferralOverview();
        if (response.success && response.data) {
          setStats([
            {
              icon: CalendarClock,
              label: "MENUNGGU KONFIRMASI",
              value: response.data.pending,
              bgColor: "bg-indigo-100",
              textColor: "text-indigo-500",
            },
            {
              icon: CalendarCheck,
              label: "JADWAL TERKONFIRMASI",
              value: response.data.confirmed,
              bgColor: "bg-indigo-100",
              textColor: "text-indigo-500",
            },
            {
              icon: CheckCircle,
              label: "KASUS SELESAI",
              value: response.data.selesai,
              bgColor: "bg-indigo-100",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch referral overview:", error);
      }
    };

    fetchStats();
  }, []);

  // Using gridCols="grid-cols-1 md:grid-cols-3" since there are exactly 3 items
  return <DashboardPanel items={stats} gridCols="grid-cols-1 md:grid-cols-3" />;
}
