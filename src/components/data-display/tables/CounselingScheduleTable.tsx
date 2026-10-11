"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  ArrowUpDown,
  Edit,
  ClipboardCheck,
  Check,
  Loader2,
  RotateCcw,
  FileText,
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
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
import {
  getReportList,
  getUsersByType,
} from "@/lib/api";
import { User, CounselingSchedule } from "@/types/api";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import RescheduleDialog from "@/components/dialogs/RescheduleDialog";
import CompleteDialog from "@/components/dialogs/CompleteDialog";


export default function CounselingScheduleTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [filteredData, setFilteredData] = useState<CounselingSchedule[]>([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [counselors, setCounselors] = useState<User[]>([]);

  // Dialog states
  const [selectedSchedule, setSelectedSchedule] =
    useState<CounselingSchedule | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isViewResultDialogOpen, setIsViewResultDialogOpen] = useState(false);


  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [reportResponse, counselorResponse] = await Promise.all([
          getReportList(),
          getUsersByType("counselor"),
        ]);

        if (reportResponse.success) {
          setSchedules(reportResponse.data);
          setFilteredData(reportResponse.data);
        } else {
          toast.error(
            reportResponse.message || "Gagal memuat data jadwal konseling"
          );
        }

        if (counselorResponse.success) {
          setCounselors(counselorResponse.data);
        } else {
          toast.error(counselorResponse.message || "Gagal memuat data guru BK");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat memuat data");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh data utility
  const refreshData = async () => {
    try {
      const reportResponse = await getReportList();
      if (reportResponse.success) {
        setSchedules(reportResponse.data);
        setFilteredData(reportResponse.data);
      }
    } catch (error) {
      toast.error("Gagal memperbarui data");
      console.error("Error refreshing data:", error);
    }
  };

  // 9 Enum ReportStatus dari BE
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

  // Get unique values for filters
  const uniqueStatus = Array.from(
    new Set([
      ...predefinedStatuses,
      ...schedules.map((item) => item.status).filter(Boolean),
    ])
  );
  const uniquePriorities = Array.from(
    new Set(["tinggi", "rendah", ...schedules.map((item) => (item.priority || "").toLowerCase()).filter(Boolean)])
  );
  const uniqueKelas = [
    ...new Set(schedules.map((item) => item.user?.room?.name || "-")),
  ];

  // Apply filters
  useEffect(() => {
    const filtered = schedules.filter((item) => {
      const matchesSearch =
        (item.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.user?.identifier || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.topic || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (item.status || "").toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority =
        priorityFilter === "all" ||
        (item.priority || "").toLowerCase() === priorityFilter.toLowerCase();
      const matchesKelas =
        kelasFilter === "all" || (item.user?.room?.name || "-") === kelasFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesKelas;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, priorityFilter, kelasFilter, schedules]);

  // Format counseling date and time helper function
  const formatCounselingDateTime = (dateString: string, timeString: string) => {
    try {
      if (!dateString) return "Belum dijadwalkan";

      const formattedDate = format(new Date(dateString), "dd/MM/yyyy");
      return `${formattedDate}, ${timeString || "00.00"}`;
    } catch {
      return "Belum dijadwalkan";
    }
  };

  // Helper functions for badges
  const getStatusBadge = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "belum ditinjau":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "sedang ditangani":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "belum ditanggapi":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "menunggu persetujuan siswa":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "konseling dijadwalkan":
      case "dijadwalkan":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "diselesaikan":
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "dibatalkan":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "jadwal ditolak siswa":
      case "ditolak oleh siswa":
      case "ditolak":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "bukan urgent":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "menunggu":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "disetujui":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    return status || "-";
  };

  const getPrioritasBadge = (prioritas: string) => {
    switch ((prioritas || "").toLowerCase()) {
      case "tinggi":
        return "bg-red-100 text-red-700 border-red-200";
      case "sedang":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "rendah":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

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

  // Dialog handlers
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

  const handleViewResult = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setIsViewResultDialogOpen(true);
  };



  // Column definitions
  const columns: ColumnDef<CounselingSchedule>[] = [
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[150px] flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-blue-600">
              {getInitials(row.original.user?.name || "Tanpa Nama")}
            </span>
          </div>
          <span className="font-medium text-gray-900 truncate">
            <p>{row.original.user?.name || "Tanpa Nama"}</p>
            <p className="text-xs text-foreground">
              {row.original.user?.username || "-"}
            </p>
          </span>
        </div>
      ),
    },
    {
      id: "kelas",
      accessorFn: (row) => row.user?.room?.name || "-",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Kelas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {row.original.user?.room?.name || "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "topic",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Topik Konseling
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[200px] max-w-[300px]">
          <div className="font-medium truncate">{row.original.topic}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Badge className={getStatusBadge(row.original.status)}>
            {getStatusLabel(row.original.status)}
          </Badge>
          <Badge className={getPrioritasBadge(row.original.priority)}>
            {row.original.priority.charAt(0).toUpperCase() +
              row.original.priority.slice(1)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Waktu Konseling
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 min-w-[120px]">
          {formatCounselingDateTime(row.original.date, row.original.time)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
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
      {/* Filter Controls - Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Cari nama siswa, NISN, atau topik konseling..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filter Dropdowns and Page Size */}
        <div className="flex flex-col sm:flex-row lg:flex-nowrap gap-2 lg:gap-3">
          {/* Kelas Filter */}
          <div className="w-full sm:min-w-[140px] lg:w-[140px]">
            <Select value={kelasFilter} onValueChange={setKelasFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {uniqueKelas.map((kelas) => (
                  <SelectItem key={kelas} value={kelas}>
                    {kelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:min-w-[140px] lg:w-[140px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {uniqueStatus.map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prioritas Filter */}
          <div className="w-full sm:min-w-[140px] lg:w-[140px]">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prioritas</SelectItem>
                {uniquePriorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto lg:w-auto">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap hidden sm:block">
              Tampilkan:
            </span>
            <span className="text-sm font-medium text-gray-600 sm:hidden">
              Per halaman:
            </span>
            <Select
              value={currentPageSize.toString()}
              onValueChange={(value) => setCurrentPageSize(Number(value))}
            >
              <SelectTrigger className="w-[80px] sm:w-[80px] lg:w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">
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
          showPageSizeSelector={false}
        />
      )}

      {/* Dialog Components */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        schedule={selectedSchedule}
        counselors={counselors}
        onRefreshData={refreshData}
      />

      <RescheduleDialog
        isOpen={isRescheduleDialogOpen}
        onClose={() => setIsRescheduleDialogOpen(false)}
        schedule={selectedSchedule}
        counselors={counselors}
        onRefreshData={refreshData}
      />

      <CompleteDialog
        isOpen={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        schedule={selectedSchedule}
        onRefreshData={refreshData}
      />

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


    </div>
  );
}
