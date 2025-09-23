import {
  Users,
  ClipboardList,
  Calendar,
  MessageSquareWarning,
} from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { useEffect, useState } from "react";
import { getDashboardCounselor } from "@/lib/api";

export default function CouncelorPanel() {
  const [stats, setStats] = useState([
    {
      icon: Users,
      label: "JUMLAH SISWA",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: ClipboardList,
      label: "AJUAN KONSELING",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: Calendar,
      label: "JADWAL KONSELING",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: MessageSquareWarning,
      label: "CURHATAN MASUK",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchCounselorData = async () => {
      try {
        const response = await getDashboardCounselor();
        if (response.success) {
          const {
            student_count,
            report_today_count,
            meet_today_count,
            sharing_today_count,
          } = response.data;

          setStats([
            {
              icon: Users,
              label: "JUMLAH SISWA",
              value: student_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: ClipboardList,
              label: "AJUAN KONSELING",
              value: report_today_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Calendar,
              label: "JADWAL KONSELING",
              value: meet_today_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: MessageSquareWarning,
              label: "CURHATAN MASUK",
              value: sharing_today_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch counselor dashboard data:", error);
      }
    };

    fetchCounselorData();
  }, []);

  return <DashboardPanel items={stats} />;
}
