import {
  Users,
  ClipboardList,
  ThumbsUp,
  AlertTriangle,
  Smile,
  Frown,
} from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { useEffect, useState } from "react";
import { getDashboardTeacher } from "@/lib/api";

export default function TeacherPanel() {
  const [stats, setStats] = useState([
    {
      icon: Users,
      label: "JUMLAH SISWA DIAMPU",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: ClipboardList,
      label: "LAPORAN MOOD HARI INI",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: Smile,
      label: "MOOD AMAN",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: AlertTriangle,
      label: "MOOD TIDAK AMAN",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await getDashboardTeacher();
        if (response.success) {
          const {
            student_count,
            mood_today_count,
            mood_secure_count,
            mood_insecure_count,
          } = response.data;

          setStats([
            {
              icon: Users,
              label: "JUMLAH SISWA DIAMPU",
              value: student_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: ClipboardList,
              label: "LAPORAN MOOD HARI INI",
              value: mood_today_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Smile,
              label: "MOOD AMAN",
              value: mood_secure_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Frown,
              label: "MOOD TIDAK AMAN",
              value: mood_insecure_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch teacher dashboard data:", error);
      }
    };

    fetchTeacherData();
  }, []);

  return <DashboardPanel items={stats} />;
}
