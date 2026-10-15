"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Calendar, User, Users, Activity, CheckCircle, Loader2 } from "lucide-react";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonitoringCaseCard } from "@/components/dashboard/MonitoringCaseCard";
import DashboardPanel from "@/components/dashboard/panels/DashboardPanel";
import {
  getHeadTeacherIncidents,
  getHeadTeacherDashboardStats,
  getMonitoringPenanganan,
  HeadTeacherIncident,
  HeadTeacherIncidentsParams,
} from "@/lib/api";
import { MonitoringStats, MonitoringCaseItem, MonitoringTimelineItem } from "@/types/api";
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

function mapIncidentToCaseItem(incident: HeadTeacherIncident): MonitoringCaseItem {
  const createdDate = incident.created_at ? new Date(incident.created_at) : new Date();
  const dateStr = !isNaN(createdDate.getTime())
    ? createdDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";
  const timeStr = !isNaN(createdDate.getTime())
    ? createdDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const timeline: MonitoringTimelineItem[] = [];
  if (incident.created_at) {
    const d = new Date(incident.created_at);
    timeline.push({
      date: !isNaN(d.getTime())
        ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "-",
      time: !isNaN(d.getTime())
        ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : "-",
      description: "Laporan insiden terdeteksi oleh sistem",
      status: "success",
    });
  }
  if (incident.acknowledged_at) {
    const d = new Date(incident.acknowledged_at);
    timeline.push({
      date: !isNaN(d.getTime())
        ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "-",
      time: !isNaN(d.getTime())
        ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : "-",
      description: `Ditanggapi Guru BK (${incident.assigned_counselor || "Guru BK"})`,
      status: "success",
    });
  }
  if (incident.scheduled_at) {
    const d = new Date(incident.scheduled_at);
    timeline.push({
      date: !isNaN(d.getTime())
        ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "-",
      time: !isNaN(d.getTime())
        ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : "-",
      description: "Jadwal konseling telah diagendakan",
      status: "success",
    });
  }
  if (incident.status === "Diselesaikan" || incident.status === "Selesai") {
    timeline.push({
      date: "-",
      time: "-",
      description: "Penanganan kasus selesai",
      status: "success",
    });
  }

  return {
    id: incident.id,
    studentName: incident.name || incident.student_name || "Siswa",
    className: incident.room || incident.class_name || "Kelas Siswa",
    date: dateStr,
    time: timeStr,
    counselorName: incident.assigned_counselor || "Belum Ditentukan",
    status: incident.status,
    slaStatus: incident.is_sla_breached ? "MELEBIHI BATAS WAKTU" : "DALAM BATAS WAKTU",
    timeline,
    marked: incident.marked ?? false,
    notification_id: incident.notification_id || null,
  };
}

function MonitoringPenangananContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [waktuFilter, setWaktuFilter] = useState("all");
  const [guruFilter, setGuruFilter] = useState("all");
  const [availableCounselors, setAvailableCounselors] = useState<string[]>([]);

  const [stats, setStats] = useState<MonitoringStats>({
    total_kasus_aktif: 0,
    intervensi_selesai: 0,
    rujukan_psikolog: 0,
    pelanggaran_sla: "0 Kasus",
  });
  const [cases, setCases] = useState<MonitoringCaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch initial stats and all incidents to populate counselors list & stats
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [incidentsRes, monitoringRes, statsRes] = await Promise.allSettled([
          getHeadTeacherIncidents({ per_page: 100 }),
          getMonitoringPenanganan(),
          getHeadTeacherDashboardStats(),
        ]);

        let allIncidents: HeadTeacherIncident[] = [];
        if (incidentsRes.status === "fulfilled" && incidentsRes.value?.success && Array.isArray(incidentsRes.value.data)) {
          allIncidents = incidentsRes.value.data;
          
          // Populate unique counselors list
          const uniqueCounselors = Array.from(
            new Set(allIncidents.map((i) => i.assigned_counselor).filter(Boolean))
          );
          setAvailableCounselors(uniqueCounselors);
        }

        // Determine stats
        let totalAktif = allIncidents.filter((i) => i.status !== "Diselesaikan" && i.status !== "Selesai").length;
        let selesai = allIncidents.filter((i) => i.status === "Diselesaikan" || i.status === "Selesai").length;
        let rujukan = allIncidents.filter((i) => i.status === "Dirujuk ke Psikolog").length;
        let slaBreached = allIncidents.filter((i) => i.is_sla_breached).length;

        if (monitoringRes.status === "fulfilled" && monitoringRes.value?.success && monitoringRes.value.data?.stats) {
          const s = monitoringRes.value.data.stats;
          totalAktif = s.total_kasus_aktif ?? totalAktif;
          selesai = s.intervensi_selesai ?? selesai;
          rujukan = s.rujukan_psikolog ?? rujukan;
          if (s.pelanggaran_sla !== undefined) {
            slaBreached = typeof s.pelanggaran_sla === "number" ? s.pelanggaran_sla : parseInt(String(s.pelanggaran_sla)) || slaBreached;
          }
        }

        if (statsRes.status === "fulfilled" && statsRes.value?.success && statsRes.value.data) {
          const s = statsRes.value.data;
          if (s.need_intention !== undefined) totalAktif = s.need_intention;
          if (s.resolved_interventions !== undefined) selesai = s.resolved_interventions;
          if (s.external_counseling_count !== undefined) rujukan = s.external_counseling_count;
          if (s.sla_breached_count !== undefined) slaBreached = s.sla_breached_count;
        }

        setStats({
          total_kasus_aktif: totalAktif,
          intervensi_selesai: selesai,
          rujukan_psikolog: rujukan,
          pelanggaran_sla: `${slaBreached} Kasus`,
        });
      } catch (err) {
        console.error("Error loading initial monitoring data:", err);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch incidents based on filters & search
  const fetchFilteredIncidents = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setIsFiltering(true);
    }
    try {
      const params: HeadTeacherIncidentsParams = {
        per_page: 50,
      };

      if (debouncedSearch.trim()) {
        params.name = debouncedSearch.trim();
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (waktuFilter === "MELEBIHI BATAS WAKTU") {
        params.is_breached = "true";
      } else if (waktuFilter === "DALAM BATAS WAKTU") {
        params.is_breached = "false";
      }

      if (guruFilter !== "all") {
        params.counselor_name = guruFilter;
      }

      const response = await getHeadTeacherIncidents(params);
      if (response.success && Array.isArray(response.data)) {
        const mappedCases = response.data.map(mapIncidentToCaseItem);
        setCases(mappedCases);
      } else {
        setCases([]);
      }
    } catch (error) {
      console.error("Error fetching incidents:", error);
      toast.error("Gagal memuat daftar insiden.");
      setCases([]);
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  }, [debouncedSearch, statusFilter, waktuFilter, guruFilter]);

  useEffect(() => {
    fetchFilteredIncidents();
  }, [fetchFilteredIncidents]);

  const today = new Date().toLocaleDateString("id-ID", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const statsData = [
    { title: "TOTAL KASUS AKTIF", value: stats.total_kasus_aktif, iconType: "aktif" },
    { title: "INTERVENSI SELESAI", value: stats.intervensi_selesai, iconType: "selesai" },
    { title: "RUJUKAN PSIKOLOG", value: stats.rujukan_psikolog, iconType: "rujukan" },
    { title: "PELANGGARAN SLA", value: stats.pelanggaran_sla, iconType: "sla" },
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
          <SelectTrigger className="w-full md:w-[220px] h-10 rounded-lg border-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Belum Ditinjau">Belum Ditinjau</SelectItem>
            <SelectItem value="Sedang Ditangani">Sedang Ditangani</SelectItem>
            <SelectItem value="Menunggu Persetujuan Siswa">Menunggu Persetujuan Siswa</SelectItem>
            <SelectItem value="Konseling Dijadwalkan">Konseling Dijadwalkan</SelectItem>
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
          <SelectTrigger className="w-full md:w-[220px] h-10 rounded-lg border-gray-200">
            <SelectValue placeholder="Guru BK" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Guru BK</SelectItem>
            {availableCounselors.map((counselor) => (
              <SelectItem key={counselor} value={counselor}>
                {counselor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List of Cases */}
      <div className="space-y-4">
        {isLoading || isFiltering ? (
          <div className="text-center py-12 bg-white border rounded-xl text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
            Memuat data...
          </div>
        ) : cases.length > 0 ? (
          cases.map((item) => (
            <MonitoringCaseCard
              key={item.id}
              item={item}
              onCaseMarked={(id) => {
                setCases((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, marked: true } : c))
                );
              }}
            />
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
