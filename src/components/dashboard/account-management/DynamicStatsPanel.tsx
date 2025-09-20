"use client";

import { Card } from "@/components/ui/card";
import { 
  Users, 
  AlertTriangle,
  GraduationCap,
  UserCheck,
  Crown,
  BookOpen,
  Calendar,
  Clock
} from "lucide-react";
import { UserRole } from "@/types/auth";
import { User } from "./user-table";

interface DynamicStatsPanelProps {
  activeTab: UserRole | "all";
  users: User[];
}

export function DynamicStatsPanel({ activeTab, users }: DynamicStatsPanelProps) {
  const getStatsConfig = () => {
    switch (activeTab) {
      case "all":
        return {
          title: "Kelola Akun",
          subtitle: "Kelola akun pengguna Appiks",
          stats: [
            {
              label: "TOTAL PENGGUNA",
              value: users.length,
              icon: Users,
              color: "blue"
            },
            {
              label: "AKUN DIBUAT HARI INI",
              value: users.filter(u => {
                const today = new Date().toLocaleDateString("id-ID");
                return u.createdAt === today;
              }).length,
              icon: AlertTriangle,
              color: "orange"
            }
          ]
        };

      case "siswa":
        const siswaUsers = users.filter(u => u.role === "siswa");
        return {
          title: "Akun Siswa",
          subtitle: "Kelola akun siswa Appiks",
          stats: [
            {
              label: "TOTAL SISWA",
              value: siswaUsers.length,
              icon: GraduationCap,
              color: "blue"
            },
            {
              label: "KELAS TERDAFTAR",
              value: new Set(siswaUsers.filter(u => u.class).map(u => u.class)).size,
              icon: BookOpen,
              color: "purple"
            }
          ]
        };

      case "guru_wali":
        const guruWaliUsers = users.filter(u => u.role === "guru_wali");
        return {
          title: "Akun Guru Wali",
          subtitle: "Kelola akun guru wali kelas",
          stats: [
            {
              label: "TOTAL GURU WALI",
              value: guruWaliUsers.length,
              icon: GraduationCap,
              color: "blue"
            },
            {
              label: "KELAS DIAMPU",
              value: new Set(guruWaliUsers.filter(u => u.class).map(u => u.class)).size,
              icon: BookOpen,
              color: "purple"
            }
          ]
        };

      case "guru_bk":
        const guruBKUsers = users.filter(u => u.role === "guru_bk");
        return {
          title: "Akun Guru BK",
          subtitle: "Kelola akun guru bimbingan konseling",
          stats: [
            {
              label: "TOTAL GURU BK",
              value: guruBKUsers.length,
              icon: UserCheck,
              color: "blue"
            },
            {
              label: "AKUN DIBUAT HARI INI",
              value: guruBKUsers.filter(u => {
                const today = new Date().toLocaleDateString("id-ID");
                return u.createdAt === today;
              }).length,
              icon: Clock,
              color: "orange"
            }
          ]
        };

      case "kepala_sekolah":
        const kepalaSekolahUsers = users.filter(u => u.role === "kepala_sekolah");
        return {
          title: "Akun Kepala Sekolah",
          subtitle: "Kelola akun kepala sekolah",
          stats: [
            {
              label: "TOTAL KEPALA SEKOLAH",
              value: kepalaSekolahUsers.length,
              icon: Crown,
              color: "blue"
            },
            {
              label: "AKUN DIBUAT BULAN INI",
              value: kepalaSekolahUsers.filter(u => {
                const currentMonth = new Date().getMonth();
                const userDate = new Date(u.createdAt.split('/').reverse().join('-'));
                return userDate.getMonth() === currentMonth;
              }).length,
              icon: Calendar,
              color: "purple"
            }
          ]
        };

      default:
        return {
          title: "Kelola Akun",
          subtitle: "Kelola akun pengguna Appiks",
          stats: []
        };
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          valueText: "text-blue-600"
        };
      case "purple":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          valueText: "text-purple-600"
        };
      case "green":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          valueText: "text-green-600"
        };
      case "orange":
        return {
          bg: "bg-orange-100",
          text: "text-orange-600",
          valueText: "text-orange-600"
        };
      case "red":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          valueText: "text-red-600"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          valueText: "text-gray-600"
        };
    }
  };

  const config = getStatsConfig();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{config.title}</h1>
        <p className="text-gray-600 mt-2">{config.subtitle}</p>
      </div>

      {/* Statistics Panel */}
      <Card className="w-full shadow-none">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(4, config.stats.length)} divide-y md:divide-y-0 md:divide-x divide-gray-200`}>
          {config.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const colors = getColorClasses(stat.color);
            
            return (
              <div key={index} className="p-6 flex items-center space-x-4">
                <div className={`p-3 ${colors.bg} rounded-full`}>
                  <IconComponent className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${colors.valueText}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
