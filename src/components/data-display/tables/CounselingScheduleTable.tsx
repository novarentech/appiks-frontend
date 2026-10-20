"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  ClipboardCheck,
  Check,
  Loader2,
  RotateCcw,
  FileText,
  Search,
  User as UserIcon,
  MessageSquare,
  GraduationCap,
  X,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Utils and API
import { getInitials } from "@/lib/utils";
import { getReportList, getUsersByType, getRooms } from "@/lib/api";
import { User, CounselingSchedule, ReportListParams } from "@/types/api";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import RescheduleDialog from "@/components/dialogs/RescheduleDialog";
import CompleteDialog from "@/components/dialogs/CompleteDialog";

export default function CounselingScheduleTable() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search");

  // Filter States
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch || "");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "student" | "curhat" | "regular">("all");

  // Data States
  const [allReports, setAllReports] = useState<CounselingSchedule[]>([]);
  const [filteredData, setFilteredData] = useState<CounselingSchedule[]>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [counselors, setCounselors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  // Dialog States
  const [selectedSchedule, setSelectedSchedule] = useState<CounselingSchedule | null>(null);
  const [isViewResultDialogOpen, setIsViewResultDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  // Sync search query parameter if provided
  useEffect(() => {
    if (urlSearch) {
      setSearchTerm(urlSearch);
      setDebouncedSearch(urlSearch);
    }
  }, [urlSearch]);

  // Debounce search input (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Predefined statuses in system
  const predefinedStatuses = [
    "Belum Ditinjau",
    "Sedang Ditangani",
    "Belum Ditanggapi",
    "Menunggu Persetujuan Siswa",
    "Konseling Dijadwalkan",
    "Diselesaikan",
    "Dibatalkan",
    "Jadwal Ditolak Siswa",
    "Bukan Urgent",
  ];

  // Room options from API & reports
  const roomOptions = useMemo(() => {
    const fromReports = allReports
      .map((r) => r.user?.room?.name || r.room)
      .filter((name): name is string => Boolean(name && name !== "-"));
    return Array.from(new Set([...availableRooms, ...fromReports])).sort();
  }, [availableRooms, allReports]);

  // Status options from predefined & reports
  const statusOptions = useMemo(() => {
    const fromReports = allReports
      .map((r) => r.status)
      .filter((st): st is string => Boolean(st));
    return Array.from(new Set([...predefinedStatuses, ...fromReports]));
  }, [allReports]);

  // Calculate dynamic counts for source filter pills from all reports
  const counts = useMemo(() => {
    let siswaCount = 0;
    let curhatCount = 0;
    let guruBkCount = 0;

    allReports.forEach((item) => {
      const isCurhat =
        Boolean(item.sharing_id) ||
        item.source_type === "sharing" ||
        (item as any).source === "sharing";
      const isStudent =
        item.source_type === "student" || (item as any).source === "student";

      if (isCurhat) {
        curhatCount++;
      } else if (isStudent) {
        siswaCount++;
      } else {
        guruBkCount++;
      }
    });

    return {
      all: allReports.length,
      siswa: siswaCount,
      curhat: curhatCount,
      guruBk: guruBkCount,
    };
  }, [allReports]);

  // Server-side filtered data fetcher
  const fetchFilteredData = useCallback(async () => {
    try {
      setIsLoading(true);

      const params: ReportListParams = {};
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (kelasFilter !== "all") {
        params.room = kelasFilter;
      }
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      // Backend accepts "all", "student", "regular"
      if (sourceFilter === "student") {
        params.source = "student";
      } else if (sourceFilter === "regular") {
        params.source = "regular";
      } else if (sourceFilter === "curhat") {
        params.source = "regular"; // curhat uses regular source with sharing_id
      } else {
        params.source = "all";
      }

      const reportResponse = await getReportList(params);

      if (reportResponse.success && Array.isArray(reportResponse.data)) {
        let items = reportResponse.data;

        // Specific client-side refinement for curhat vs direct regular
        if (sourceFilter === "curhat") {
          items = items.filter(
            (item) =>
              Boolean(item.sharing_id) ||
              item.source_type === "sharing" ||
              (item as any).source === "sharing"
          );
        } else if (sourceFilter === "regular") {
          items = items.filter(
            (item) =>
              !item.sharing_id &&
              item.source_type !== "sharing" &&
              (item as any).source !== "sharing"
          );
        }

        setFilteredData(items);
      } else {
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching filtered report list:", error);
      toast.error("Gagal memuat data jadwal konseling");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, kelasFilter, statusFilter, sourceFilter]);

  // Initial fetch for total data, room list, and counselor list
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [reportResponse, roomResponse, counselorResponse] = await Promise.all([
          getReportList(),
          getRooms().catch(() => ({ success: false, data: [] })),
          getUsersByType("counselor").catch(() => ({ success: false, data: [] })),
        ]);

        if (reportResponse.success && Array.isArray(reportResponse.data)) {
          setAllReports(reportResponse.data);
          setFilteredData(reportResponse.data);
        } else {
          toast.error(reportResponse.message || "Gagal memuat data jadwal konseling");
        }

        if (roomResponse.success && Array.isArray(roomResponse.data)) {
          setAvailableRooms(
            roomResponse.data.map((r: any) => r.name).filter(Boolean)
          );
        }

        if (counselorResponse.success && Array.isArray(counselorResponse.data)) {
          setCounselors(counselorResponse.data);
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat memuat data awal");
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
        setIsInitialLoaded(true);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch updated data when filters change after initial load
  useEffect(() => {
    if (!isInitialLoaded) return;
    fetchFilteredData();
  }, [debouncedSearch, kelasFilter, statusFilter, sourceFilter, isInitialLoaded, fetchFilteredData]);

  // Refresh data utility for child dialogs
  const refreshData = async () => {
    try {
      const [allReportRes] = await Promise.all([
        getReportList(),
        fetchFilteredData(),
      ]);
      if (allReportRes.success && Array.isArray(allReportRes.data)) {
        setAllReports(allReportRes.data);
      }
    } catch (error) {
      toast.error("Gagal memperbarui data");
      console.error("Error refreshing data:", error);
    }
  };

  // Date and Time Formatting Helpers
  const formatSubmittedTime = (
    createdAt?: string,
    dateString?: string,
    timeString?: string
  ) => {
    try {
      if (createdAt) {
        const parsed = new Date(createdAt);
        if (!isNaN(parsed.getTime())) {
          return format(parsed, "MM/dd/yyyy  hh:mm a");
        }
      }
      if (dateString) {
        const dateParts = dateString.split("T")[0];
        const timeParts = timeString || "10:00";
        const parsed = new Date(`${dateParts}T${timeParts}:00`);
        if (!isNaN(parsed.getTime())) {
          return format(parsed, "MM/dd/yyyy  hh:mm a");
        }
        return `${dateString} ${timeString || ""}`.trim();
      }
      return "-";
    } catch {
      return "-";
    }
  };

  const formatCounselingDateTime = (dateString?: string, timeString?: string) => {
    try {
      if (!dateString) return "Belum dijadwalkan";
      const formattedDate = format(new Date(dateString), "dd/MM/yyyy");
      return `${formattedDate}, ${timeString || "00.00"}`;
    } catch {
      return "Belum dijadwalkan";
    }
  };

  // Badge Style Helpers
  const getStatusBadge = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "diselesaikan":
      case "selesai":
        return "bg-[#E8FAF0] text-[#12B76A]";
      case "sedang ditangani":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "belum ditinjau":
      case "menunggu":
      case "belum ditanggapi":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "menunggu persetujuan siswa":
        return "bg-purple-50 text-purple-600 border border-purple-200";
      case "konseling dijadwalkan":
      case "dijadwalkan":
      case "disetujui":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "dibatalkan":
      case "jadwal ditolak siswa":
      case "ditolak oleh siswa":
      case "ditolak":
        return "bg-rose-50 text-rose-600 border border-rose-200";
      case "bukan urgent":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    return status || "-";
  };

  const getPrioritasBadge = (prioritas: string) => {
    switch ((prioritas || "").toLowerCase()) {
      case "tinggi":
        return "bg-red-50 text-red-600 border border-red-200";
      case "sedang":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "rendah":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  // Action enablement logic
  const isActionEnabled = (schedule: CounselingSchedule, action: string) => {
    const status = (schedule.status || "").toLowerCase();
    switch (action) {
      case "confirm":
        return [
          "belum ditinjau",
          "sedang ditangani",
          "belum ditanggapi",
          "bukan urgent",
          "menunggu",
        ].includes(status);
      case "reschedule":
        return [
          "konseling dijadwalkan",
          "menunggu persetujuan siswa",
          "disetujui",
          "dijadwalkan",
        ].includes(status);
      case "complete":
        return [
          "konseling dijadwalkan",
          "dijadwalkan",
          "disetujui",
        ].includes(status);
      default:
        return false;
    }
  };

  // Dialog open triggers
  const handleViewResult = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setIsViewResultDialogOpen(true);
  };

  const handleConfirm = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setIsConfirmDialogOpen(true);
  };

  const handleReschedule = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setIsRescheduleDialogOpen(true);
  };

  const handleComplete = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setIsCompleteDialogOpen(true);
  };

  // Columns definition matching UI design
  const columns: ColumnDef<CounselingSchedule>[] = [
    {
      accessorKey: "user.name",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className="h-auto p-0 font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-transparent inline-flex items-center gap-1"
          >
            <span>Nama</span>
            {isSorted === "desc" ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original.user?.name || "Tanpa Nama";
        const initials = getInitials(name);
        return (
          <div className="flex items-center space-x-3 py-1">
            <div className="w-9 h-9 rounded-full bg-[#5D5FEF] text-white flex items-center justify-center flex-shrink-0 font-semibold text-xs shadow-xs">
              {initials}
            </div>
            <span className="font-medium text-gray-900 text-sm truncate max-w-[190px]">
              {name}
            </span>
          </div>
        );
      },
    },
    {
      id: "nisn",
      accessorFn: (row) => row.user?.identifier || "-",
      header: () => (
        <span className="font-semibold text-indigo-600 text-xs sm:text-sm">
          NISN
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 font-medium">
          {row.original.user?.identifier || "-"}
        </span>
      ),
    },
    {
      id: "kelas",
      accessorFn: (row) => row.user?.room?.name || row.room || "-",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className="h-auto p-0 font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-transparent inline-flex items-center gap-1"
          >
            <span>Kelas</span>
            {isSorted === "desc" ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const roomName = row.original.user?.room?.name || row.original.room || "-";
        return (
          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full border border-gray-300 text-xs font-medium text-gray-700 bg-white shadow-none whitespace-nowrap">
            {roomName}
          </span>
        );
      },
    },
    {
      accessorKey: "topic",
      header: () => (
        <span className="font-semibold text-indigo-600 text-xs sm:text-sm">
          Topik Konseling
        </span>
      ),
      cell: ({ row }) => (
        <div
          className="max-w-[260px] text-sm text-gray-800 truncate"
          title={row.original.topic}
        >
          {row.original.topic || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <span className="font-semibold text-indigo-600 text-xs sm:text-sm">
          Status
        </span>
      ),
      cell: ({ row }) => {
        const status = row.original.status || "-";
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
              status
            )}`}
          >
            {getStatusLabel(status)}
          </span>
        );
      },
    },
    {
      id: "waktu_diajukan",
      accessorFn: (row) => row.created_at || row.date || "",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className="h-auto p-0 font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-transparent inline-flex items-center gap-1"
          >
            <span>Waktu Diajukan</span>
            {isSorted === "desc" ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
          {formatSubmittedTime(
            row.original.created_at,
            row.original.date,
            row.original.time
          )}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => (
        <span className="font-semibold text-indigo-600 text-xs sm:text-sm">
          Aksi
        </span>
      ),
      cell: ({ row }) => {
        const schedule = row.original;
        const normalizedStatus = (schedule.status || "").toLowerCase();

        // 1. Status 'Jadwal Ditolak Siswa' (atau 'ditolak oleh siswa'): Tombol 'Ajukan Jadwal Konseling Kembali'
        if (
          normalizedStatus === "jadwal ditolak siswa" ||
          normalizedStatus === "ditolak oleh siswa" ||
          normalizedStatus === "ditolak"
        ) {
          return (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-2.5 font-medium border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 flex items-center gap-1.5 whitespace-nowrap"
              onClick={() => handleConfirm(schedule)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Ajukan Jadwal Konseling Kembali</span>
            </Button>
          );
        }

        // 2. Status 'Diselesaikan' atau 'Dibatalkan': Tombol 'Lihat Hasil' / 'Lihat Alasan'
        if (
          normalizedStatus === "diselesaikan" ||
          normalizedStatus === "selesai" ||
          normalizedStatus === "dibatalkan"
        ) {
          return (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-2.5 font-medium border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 whitespace-nowrap"
              onClick={() => handleViewResult(schedule)}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>
                {normalizedStatus === "dibatalkan" ? "Lihat Alasan" : "Lihat Hasil"}
              </span>
            </Button>
          );
        }

        // 3. Status aktif lainnya: 3 aksi (Konfirmasi/Jadwalkan, Ubah Jadwal, Tandai Selesai)
        return (
          <TooltipProvider>
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      isActionEnabled(schedule, "confirm")
                        ? "text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                        : "text-gray-300 border-gray-200 cursor-not-allowed hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      isActionEnabled(schedule, "confirm") &&
                      handleConfirm(schedule)
                    }
                    disabled={!isActionEnabled(schedule, "confirm")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Atur / Konfirmasi Jadwal</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      isActionEnabled(schedule, "reschedule")
                        ? "text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                        : "text-gray-300 border-gray-200 cursor-not-allowed hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      isActionEnabled(schedule, "reschedule") &&
                      handleReschedule(schedule)
                    }
                    disabled={!isActionEnabled(schedule, "reschedule")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ubah Jadwal</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      isActionEnabled(schedule, "complete")
                        ? "text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                        : "text-gray-300 border-gray-200 cursor-not-allowed hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      isActionEnabled(schedule, "complete") &&
                      handleComplete(schedule)
                    }
                    disabled={!isActionEnabled(schedule, "complete")}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tandai Selesai & Catat Hasil</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter Bar: Search, Kelas, Status, and Source Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 py-1">
        {/* Left Side: Search & Filter Dropdowns with Fixed Widths */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Search Input with Search Icon (Fixed Width 240px) */}
          <div className="relative w-[240px] shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-8 h-10 bg-white border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 shadow-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Pilih Kelas Dropdown (Fixed Width 150px) */}
          <div className="w-[150px] shrink-0">
            <Select value={kelasFilter} onValueChange={setKelasFilter}>
              <SelectTrigger className="w-full h-10 bg-white border-slate-200 rounded-xl text-sm text-slate-600 shadow-none hover:border-slate-300 transition-all font-normal">
                <SelectValue placeholder="Pilih Kelas" className="truncate">
                  {kelasFilter === "all" ? "Pilih Kelas" : kelasFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-lg border-slate-200">
                <SelectItem value="all">Semua Kelas</SelectItem>
                {roomOptions.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pilih Status Dropdown (Fixed Width 160px) */}
          <div className="w-[160px] shrink-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full h-10 bg-white border-slate-200 rounded-xl text-sm text-slate-600 shadow-none hover:border-slate-300 transition-all font-normal">
                <SelectValue placeholder="Pilih Status" className="truncate">
                  {statusFilter === "all" ? "Pilih Status" : getStatusLabel(statusFilter)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-lg border-slate-200">
                <SelectItem value="all">Semua Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Side: Source Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <span className="text-sm text-slate-500 font-normal mr-1 whitespace-nowrap">
            Sumber:
          </span>

          {/* Semua */}
          <button
            type="button"
            onClick={() => setSourceFilter("all")}
            className={`px-4 h-9 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              sourceFilter === "all"
                ? "border border-slate-400 bg-slate-100/80 text-slate-900 font-semibold shadow-xs"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            Semua
          </button>

          {/* Siswa */}
          <button
            type="button"
            onClick={() => setSourceFilter("student")}
            className={`inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              sourceFilter === "student"
                ? "border-2 border-[#5D5FEF] bg-[#5D5FEF]/10 text-[#5D5FEF] font-semibold shadow-xs"
                : "border border-[#5D5FEF]/40 bg-white text-[#5D5FEF] hover:bg-[#5D5FEF]/5"
            }`}
          >
            <UserIcon className="h-4 w-4 text-[#5D5FEF]" />
            <span>Siswa ({counts.siswa})</span>
          </button>

          {/* Curhat */}
          <button
            type="button"
            onClick={() => setSourceFilter("curhat")}
            className={`inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              sourceFilter === "curhat"
                ? "border-2 border-[#5D5FEF] bg-[#5D5FEF]/10 text-[#5D5FEF] font-semibold shadow-xs"
                : "border border-[#5D5FEF]/40 bg-white text-[#5D5FEF] hover:bg-[#5D5FEF]/5"
            }`}
          >
            <MessageSquare className="h-4 w-4 text-[#5D5FEF]" />
            <span>Curhat ({counts.curhat})</span>
          </button>

          {/* Guru BK */}
          <button
            type="button"
            onClick={() => setSourceFilter("regular")}
            className={`inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              sourceFilter === "regular"
                ? "border-2 border-[#5D5FEF] bg-[#5D5FEF]/10 text-[#5D5FEF] font-semibold shadow-xs"
                : "border border-[#5D5FEF]/40 bg-white text-[#5D5FEF] hover:bg-[#5D5FEF]/5"
            }`}
          >
            <GraduationCap className="h-4 w-4 text-[#5D5FEF]" />
            <span>Guru BK ({counts.guruBk})</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16 bg-white rounded-lg border border-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-sm text-gray-600">
            Memuat data jadwal konseling...
          </span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          searchColumn=""
          searchPlaceholder=""
          showColumnToggle={false}
          showPagination={true}
          pageSize={currentPageSize}
          pageSizeOptions={[5, 10, 15, 20, 25, 50]}
          showPageSizeSelector={true}
        />
      )}

      {/* View Result Dialog for Diselesaikan / Dibatalkan */}
      <Dialog open={isViewResultDialogOpen} onOpenChange={setIsViewResultDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSchedule?.status?.toLowerCase() === "dibatalkan"
                ? "Detail Pembatalan Konseling"
                : "Catatan Hasil Konseling"}
            </DialogTitle>
            <DialogDescription>
              {selectedSchedule?.status?.toLowerCase() === "dibatalkan"
                ? "Alasan dan informasi terkait pembatalan sesi konseling siswa."
                : "Rangkuman dan catatan hasil dari sesi konseling yang telah diselesaikan."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-sm">
            <div className="p-3 bg-gray-50 border rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Siswa</span>
                <span className="font-medium text-gray-800">
                  {selectedSchedule?.user?.name || "Tanpa Nama"} (
                  {selectedSchedule?.user?.room?.name || selectedSchedule?.user?.username || "-"}
                  )
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Topik</span>
                <span className="font-medium text-gray-800">
                  {selectedSchedule?.topic || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Waktu Sesi</span>
                <span className="font-medium text-gray-800">
                  {selectedSchedule?.date
                    ? formatCounselingDateTime(selectedSchedule.date, selectedSchedule.time)
                    : "-"}
                </span>
              </div>
            </div>

            {selectedSchedule?.notes && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Keluhan / Catatan Awal Siswa:
                </p>
                <div className="p-3 bg-gray-50 border rounded-lg text-gray-700 italic text-xs leading-relaxed">
                  "{selectedSchedule.notes}"
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">
                {selectedSchedule?.status?.toLowerCase() === "dibatalkan"
                  ? "Alasan Pembatalan:"
                  : "Catatan Hasil Konseling:"}
              </p>
              <div className="p-3 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm leading-relaxed whitespace-pre-wrap min-h-[60px]">
                {selectedSchedule?.result || (
                  <span className="text-gray-400 italic">Belum ada catatan.</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewResultDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        schedule={selectedSchedule}
        counselors={counselors}
        onRefreshData={refreshData}
      />

      {/* Reschedule Dialog */}
      <RescheduleDialog
        isOpen={isRescheduleDialogOpen}
        onClose={() => setIsRescheduleDialogOpen(false)}
        schedule={selectedSchedule}
        counselors={counselors}
        onRefreshData={refreshData}
      />

      {/* Complete Dialog */}
      <CompleteDialog
        isOpen={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        schedule={selectedSchedule}
        onRefreshData={refreshData}
      />
    </div>
  );
}
