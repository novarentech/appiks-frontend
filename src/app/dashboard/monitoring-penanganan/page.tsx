"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, User, ChevronRight, Users, Activity, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonitoringCaseCard } from "@/components/dashboard/MonitoringCaseCard";
import DashboardPanel from "@/components/dashboard/panels/DashboardPanel";
import { getMonitoringPenanganan } from "@/lib/api";
import { MonitoringStats, MonitoringCaseItem } from "@/types/api";
import { toast } from "sonner";
import { RedZoneAlertModal } from "@/components/dashboard/RedZoneAlertModal";
import { useAuth } from "@/hooks/useAuth";

export default function MonitoringPenangananPage() {
  return (
    <RoleGuard permissionType="monitoring-penanganan">
      <MonitoringPenangananContent />
    </RoleGuard>
  );
}

function MonitoringPenangananContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [waktuFilter, setWaktuFilter] = useState("all");
  const [guruFilter, setGuruFilter] = useState("all");

  const [data, setData] = useState<{stats: MonitoringStats, cases: MonitoringCaseItem[]} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMonitoringPenanganan();
        if (response.success) {
          setData(response.data);
        } else {
          toast.error(response.message || "Gagal memuat data monitoring");
        }
      } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan saat memuat data monitoring");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const statsData = [
    { title: "TOTAL KASUS AKTIF", value: data?.stats?.total_kasus_aktif || 0, iconType: "aktif" },
    { title: "INTERVENSI SELESAI", value: data?.stats?.intervensi_selesai || 0, iconType: "selesai" },
    { title: "RUJUKAN PSIKOLOG", value: data?.stats?.rujukan_psikolog || 0, iconType: "rujukan" },
    { title: "PELANGGARAN SLA", value: data?.stats?.pelanggaran_sla || "0 Kasus", iconType: "sla" },
  ];

  const statsForPanel = statsData.map((stat) => {
    let icon;
    switch (stat.iconType) {
      case "aktif":
        icon = Users;
        break;
      case "selesai":
        icon = CheckCircle;
        break;
      case "rujukan":
        icon = Activity;
        break;
      case "sla":
        icon = User;
        break;
      default:
        icon = Users;
    }

    return {
      icon,
      label: stat.title,
      value: stat.value,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    };
  });

  const casesToFilter = data?.cases || [];
  const filteredCases = casesToFilter.filter((item) => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesWaktu = waktuFilter === "all" || item.slaStatus === waktuFilter;
    const matchesGuru = guruFilter === "all" || item.counselorName === guruFilter;
    return matchesSearch && matchesStatus && matchesWaktu && matchesGuru;
  });

  return (
    <div className="space-y-6 pb-10">
      {user?.role === "headteacher" && <RedZoneAlertModal />}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Monitoring Penanganan Kasus Siswa
          </h1>
          <p className="text-gray-500 mt-1">Pantau kondisi siswa</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg border border-gray-100 text-sm font-medium">
          <Calendar className="w-4 h-4 text-gray-500" />
          {today}
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <DashboardPanel items={statsForPanel} />
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Cari nama siswa..." 
            className="pl-9 h-10 w-full rounded-lg border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px] h-10 rounded-lg border-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Belum Ditangani BK">Belum Ditangani BK</SelectItem>
            <SelectItem value="Sedang Ditangani BK">Sedang Ditangani BK</SelectItem>
            <SelectItem value="Dirujuk ke Psikolog">Dirujuk ke Psikolog</SelectItem>
            <SelectItem value="Diselesaikan">Diselesaikan</SelectItem>
          </SelectContent>
        </Select>
        <Select value={waktuFilter} onValueChange={setWaktuFilter}>
          <SelectTrigger className="w-full md:w-[200px] h-10 rounded-lg border-gray-200">
            <SelectValue placeholder="Batas Waktu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Waktu</SelectItem>
            <SelectItem value="DALAM BATAS WAKTU">Dalam Batas Waktu</SelectItem>
            <SelectItem value="MELEBIHI BATAS WAKTU">Melebihi Batas Waktu</SelectItem>
          </SelectContent>
        </Select>
        <Select value={guruFilter} onValueChange={setGuruFilter}>
          <SelectTrigger className="w-full md:w-[200px] h-10 rounded-lg border-gray-200">
            <SelectValue placeholder="Guru BK" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Guru BK</SelectItem>
            <SelectItem value="Sri Wahyuni, S.Pd, M.Pd">Sri Wahyuni, S.Pd, M.Pd</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List of Cases */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 bg-white border rounded-xl text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
            Memuat data...
          </div>
        ) : filteredCases.length > 0 ? (
          filteredCases.map((item) => (
            <MonitoringCaseCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center py-12 bg-white border rounded-xl text-gray-500">
            Tidak ada data kasus yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
