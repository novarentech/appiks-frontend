import { University, ShieldUserIcon, User } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

export default function TuPanel() {
  const stats = [
    {
      icon: University,
      label: "TOTAL SEKOLAH",
      value: 32,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: ShieldUserIcon,
      label: "TOTAL TU",
      value: 25,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: User,
      label: "TOTAL SISWA",
      value: 200,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
  ];

  return <DashboardPanel items={stats} />;
}
