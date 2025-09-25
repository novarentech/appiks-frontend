import {
  Users,
  ClipboardList,
  ThumbsUp,
  AlertTriangle,
  Newspaper,
  Play,
  Quote,
} from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { useEffect, useState } from "react";
import { getContentStatistics } from "@/lib/api";
import { ContentStatisticsResponse } from "@/types/api";

export default function ContentManagementPanel() {
  const [stats, setStats] = useState([
    {
      icon: ThumbsUp,
      label: "TOTAL KONTEN ARTIKEL",
      value: 0,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      icon: AlertTriangle,
      label: "TOTAL KONTEN VIDEO",
      value: 0,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      icon: ClipboardList,
      label: "TOTAL KONTEN QUOTES",
      value: 0,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: ContentStatisticsResponse =
          await getContentStatistics();

        if (response.success && response.data) {
          setStats([
            {
              icon: Newspaper,
              label: "TOTAL KONTEN ARTIKEL",
              value: response.data.article_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Play,
              label: "TOTAL KONTEN VIDEO",
              value: response.data.video_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Quote,
              label: "TOTAL KONTEN QUOTES",
              value: response.data.quote_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching content statistics:", error);
      }
    };

    fetchStats();
  }, []);

  return <DashboardPanel items={stats} />;
}
