"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircle,
  Edit,
  X,
  ClipboardCheck,
  CalendarIcon,
  Clock,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Types
interface CounselingSchedule {
  id: number;
  siswa: {
    nama: string;
    nisn: string;
    kelas: string;
  };
  topikKonseling: string;
  status:
    | "menunggu"
    | "disetujui"
    | "dijadwalkanUlang"
    | "selesai"
    | "dibatalkan";
  prioritas: "rendah" | "sedang" | "tinggi";
  waktuDiajukan: string;
  jadwalKonseling?: {
    tanggal: string;
    waktu: string;
    guruBK: string;
    ruangan: string;
  };
  catatanKonfirmasi?: string;
  alasanPembatalan?: string;
  hasilKonseling?: string;
}

// Sample data
const counselingScheduleData: CounselingSchedule[] = [
  {
    id: 1,
    siswa: {
      nama: "Alex Allan",
      nisn: "THD-64651",
      kelas: "X IPA 1",
    },
    topikKonseling: "Masalah dengan Teman Sekelas",
    status: "menunggu",
    prioritas: "tinggi",
    waktuDiajukan: "26/08/2025 10:00",
    jadwalKonseling: {
      tanggal: "27/08/2025",
      waktu: "10:00 AM",
      guruBK: "Sri Wahyuni, S.Pd, M.Pd",
      ruangan: "Ruang BK 1",
    },
    catatanKonfirmasi: "oke acc, jangan lupa datang tepat waktu ya.",
  },
  {
    id: 2,
    siswa: {
      nama: "Anna Vincenti",
      nisn: "WTC-78415",
      kelas: "X IPA 1",
    },
    topikKonseling: "Kesulitan Belajar Matematika",
    status: "disetujui",
    prioritas: "sedang",
    waktuDiajukan: "25/08/2025 15:30",
    jadwalKonseling: {
      tanggal: "27/08/2025",
      waktu: "10:00 AM",
      guruBK: "Sri Wahyuni, S.Pd, M.Pd",
      ruangan: "Ruang BK 1",
    },
    catatanKonfirmasi: "oke acc, jangan lupa datang tepat waktu ya.",
  },
  {
    id: 3,
    siswa: {
      nama: "David Kim",
      nisn: "MBQ-39617",
      kelas: "X IPA 2",
    },
    topikKonseling: "Masalah Keluarga di Rumah",
    status: "dijadwalkanUlang",
    prioritas: "tinggi",
    waktuDiajukan: "24/08/2025 20:15",
    jadwalKonseling: {
      tanggal: "28/08/2025",
      waktu: "10:00 AM",
      guruBK: "Sri Wahyuni, S.Pd, M.Pd",
      ruangan: "Ruang BK 1",
    },
  },
  {
    id: 4,
    siswa: {
      nama: "Falon Al-Sayed",
      nisn: "XCU-35036",
      kelas: "XI IPS 1",
    },
    topikKonseling: "Kecemasan Menghadapi Ujian",
    status: "selesai",
    prioritas: "sedang",
    waktuDiajukan: "23/08/2025 10:00",
    jadwalKonseling: {
      tanggal: "24/08/2025",
      waktu: "10:00 AM",
      guruBK: "Sri Wahyuni, S.Pd, M.Pd",
      ruangan: "Ruang BK 1",
    },
    hasilKonseling:
      "Berhasil membantu siswa mengatasi kecemasan dengan teknik relaksasi dan persiapan mental",
  },
  {
    id: 5,
    siswa: {
      nama: "Hiroshi Yamamoto",
      nisn: "LZN-37419",
      kelas: "XI IPS 1",
    },
    topikKonseling: "Bullying di Sekolah",
    status: "dibatalkan",
    prioritas: "tinggi",
    waktuDiajukan: "22/08/2025 07:45",
    alasanPembatalan:
      "Siswa tidak hadir setelah beberapa kali dijadwalkan ulang",
  },
  {
    id: 6,
    siswa: {
      nama: "Siti Nurhaliza",
      nisn: "PKL-42856",
      kelas: "XII IPA 2",
    },
    topikKonseling: "Stres Menghadapi UTBK",
    status: "menunggu",
    prioritas: "tinggi",
    waktuDiajukan: "28/08/2025 14:20",
  },
  {
    id: 7,
    siswa: {
      nama: "Muhammad Rizky",
      nisn: "QWE-78923",
      kelas: "XI IPA 3",
    },
    topikKonseling: "Konflik dengan Orang Tua",
    status: "disetujui",
    prioritas: "sedang",
    waktuDiajukan: "27/08/2025 11:15",
    jadwalKonseling: {
      tanggal: "29/08/2025",
      waktu: "11:00 AM",
      guruBK: "Ahmad Rizki, S.Pd",
      ruangan: "Ruang BK 2",
    },
    catatanKonfirmasi: "Jadwal sudah dikonfirmasi, mohon hadir tepat waktu.",
  },
  {
    id: 8,
    siswa: {
      nama: "Lisa Anggraini",
      nisn: "ZXC-15674",
      kelas: "X IPS 2",
    },
    topikKonseling: "Kesulitan Adaptasi Lingkungan Sekolah",
    status: "selesai",
    prioritas: "rendah",
    waktuDiajukan: "26/08/2025 09:30",
    jadwalKonseling: {
      tanggal: "27/08/2025",
      waktu: "14:00 PM",
      guruBK: "Sri Wahyuni, S.Pd, M.Pd",
      ruangan: "Ruang Konseling",
    },
    hasilKonseling:
      "Siswa sudah lebih percaya diri dan mulai beradaptasi dengan baik di lingkungan sekolah baru",
  },
  {
    id: 9,
    siswa: {
      nama: "Kevin Pratama",
      nisn: "ASD-96321",
      kelas: "XII IPS 1",
    },
    topikKonseling: "Kebingungan Memilih Jurusan Kuliah",
    status: "dijadwalkanUlang",
    prioritas: "sedang",
    waktuDiajukan: "25/08/2025 16:45",
    jadwalKonseling: {
      tanggal: "30/08/2025",
      waktu: "13:30 PM",
      guruBK: "Ahmad Rizki, S.Pd",
      ruangan: "Ruang BK 1",
    },
  },
  {
    id: 10,
    siswa: {
      nama: "Maya Safitri",
      nisn: "JKL-84719",
      kelas: "XI IPS 2",
    },
    topikKonseling: "Masalah Percaya Diri",
    status: "dibatalkan",
    prioritas: "rendah",
    waktuDiajukan: "24/08/2025 13:25",
    alasanPembatalan:
      "Siswa sudah merasa lebih baik dan tidak memerlukan konseling lagi",
  },
];

interface CounselingScheduleTableProps {
  onScheduleUpdate?: (
    scheduleId: number,
    action: string,
    data?: Record<string, unknown>
  ) => void;
}

export default function CounselingScheduleTable({
  onScheduleUpdate,
}: CounselingScheduleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [prioritasFilter, setPrioritasFilter] = useState("all");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [filteredData, setFilteredData] = useState(counselingScheduleData);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  // Dialog states
  const [selectedSchedule, setSelectedSchedule] =
    useState<CounselingSchedule | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Form states
  const [confirmationData, setConfirmationData] = useState({
    ruangan: "",
    catatan: "",
  });
  const [rescheduleData, setRescheduleData] = useState({
    tanggal: undefined as Date | undefined,
    waktu: "",
    guruBK: "",
    ruangan: "",
  });
  const [completionNote, setCompletionNote] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  // Get unique values for filters
  const uniqueStatus = [
    ...new Set(counselingScheduleData.map((item) => item.status)),
  ];
  const uniquePrioritas = [
    ...new Set(counselingScheduleData.map((item) => item.prioritas)),
  ];
  const uniqueKelas = [
    ...new Set(counselingScheduleData.map((item) => item.siswa.kelas)),
  ];

  // Apply filters
  useEffect(() => {
    const filtered = counselingScheduleData.filter((item) => {
      const matchesSearch =
        item.siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.siswa.nisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topikKonseling.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesPrioritas =
        prioritasFilter === "all" || item.prioritas === prioritasFilter;
      const matchesKelas =
        kelasFilter === "all" || item.siswa.kelas === kelasFilter;

      return matchesSearch && matchesStatus && matchesPrioritas && matchesKelas;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, prioritasFilter, kelasFilter]);

  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants = {
      menunggu: "bg-yellow-100 text-yellow-800 border-yellow-200",
      disetujui: "bg-blue-100 text-blue-800 border-blue-200",
      dijadwalkanUlang: "bg-orange-100 text-orange-800 border-orange-200",
      selesai: "bg-green-100 text-green-800 border-green-200",
      dibatalkan: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      menunggu: "Menunggu",
      disetujui: "Disetujui",
      dijadwalkanUlang: "Dijadwalkan Ulang",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPrioritasBadge = (prioritas: string) => {
    const variants = {
      rendah: "bg-blue-100 text-blue-800 border-blue-200",
      sedang: "bg-orange-100 text-orange-800 border-orange-200",
      tinggi: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      variants[prioritas as keyof typeof variants] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const isActionEnabled = (schedule: CounselingSchedule, action: string) => {
    switch (schedule.status) {
      case "menunggu":
        return ["confirm", "cancel"].includes(action);
      case "disetujui":
        return ["reschedule", "complete", "cancel"].includes(action);
      case "dijadwalkanUlang":
        return ["complete", "cancel"].includes(action);
      case "selesai":
      case "dibatalkan":
        return false;
      default:
        return false;
    }
  };

  // Dialog handlers
  const handleConfirm = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setConfirmationData({
      ruangan: "",
      catatan: "",
    });
    setIsConfirmDialogOpen(true);
  };

  const handleReschedule = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    // Parse existing date if available
    let existingDate: Date | undefined = undefined;
    if (schedule.jadwalKonseling?.tanggal) {
      const [day, month, year] = schedule.jadwalKonseling.tanggal.split("/");
      existingDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
    }

    setRescheduleData({
      tanggal: existingDate,
      waktu: schedule.jadwalKonseling?.waktu || "",
      guruBK: schedule.jadwalKonseling?.guruBK || "",
      ruangan: schedule.jadwalKonseling?.ruangan || "",
    });
    setIsRescheduleDialogOpen(true);
  };

  const handleComplete = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setCompletionNote("");
    setIsCompleteDialogOpen(true);
  };

  const handleCancel = (schedule: CounselingSchedule) => {
    setSelectedSchedule(schedule);
    setCancellationReason("");
    setIsCancelDialogOpen(true);
  };

  const handleSubmitConfirmation = () => {
    if (selectedSchedule && confirmationData.ruangan) {
      // Use existing schedule data for confirmation with current date/time
      const currentDate = new Date();
      const confirmData = {
        tanggal: format(currentDate, "dd/MM/yyyy"),
        waktu: format(currentDate, "HH:mm"),
        guruBK: "Sri Wahyuni, S.Pd, M.Pd", // Default teacher
        ruangan: confirmationData.ruangan,
        catatan: confirmationData.catatan,
      };
      onScheduleUpdate?.(selectedSchedule.id, "confirm", confirmData);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleSubmitReschedule = () => {
    if (selectedSchedule && rescheduleData.tanggal && rescheduleData.waktu) {
      const rescheduleDataFormatted = {
        tanggal: format(rescheduleData.tanggal, "dd/MM/yyyy"),
        waktu: rescheduleData.waktu,
        guruBK: rescheduleData.guruBK,
        ruangan: rescheduleData.ruangan,
      };
      onScheduleUpdate?.(
        selectedSchedule.id,
        "reschedule",
        rescheduleDataFormatted
      );
      setIsRescheduleDialogOpen(false);
    }
  };

  const handleSubmitCompletion = () => {
    if (selectedSchedule && completionNote.trim()) {
      onScheduleUpdate?.(selectedSchedule.id, "complete", {
        note: completionNote,
      });
      setIsCompleteDialogOpen(false);
    }
  };

  const handleSubmitCancellation = () => {
    if (selectedSchedule && cancellationReason.trim()) {
      onScheduleUpdate?.(selectedSchedule.id, "cancel", {
        reason: cancellationReason,
      });
      setIsCancelDialogOpen(false);
    }
  };

  // Column definitions
  const columns: ColumnDef<CounselingSchedule>[] = [
    {
      accessorKey: "siswa.nama",
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
              {row.original.siswa.nama
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <span className="font-medium text-gray-900 truncate">
            <p>{row.original.siswa.nama}</p>
            <p className="text-xs text-foreground">{row.original.siswa.nisn}</p>
          </span>
        </div>
      ),
    },
    {
      accessorKey: "siswa.kelas",
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
          {row.original.siswa.kelas}
        </Badge>
      ),
    },
    {
      accessorKey: "topikKonseling",
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
          <div className="font-medium truncate">
            {row.original.topikKonseling}
          </div>
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
          <Badge className={getPrioritasBadge(row.original.prioritas)}>
            {row.original.prioritas.charAt(0).toUpperCase() +
              row.original.prioritas.slice(1)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "waktuDiajukan",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Waktu Diajukan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 min-w-[120px]">
          {row.original.waktuDiajukan}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const schedule = row.original;
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
                  <p>Konfirmasi Konseling</p>
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
                  <p>Tandai Selesai</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      isActionEnabled(schedule, "cancel")
                        ? "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        : "text-gray-300 border-gray-200 cursor-not-allowed hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      isActionEnabled(schedule, "cancel") &&
                      handleCancel(schedule)
                    }
                    disabled={!isActionEnabled(schedule, "cancel")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Batalkan Jadwal</p>
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
            <Select value={prioritasFilter} onValueChange={setPrioritasFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prioritas</SelectItem>
                {uniquePrioritas.map((prioritas) => (
                  <SelectItem key={prioritas} value={prioritas}>
                    {prioritas.charAt(0).toUpperCase() + prioritas.slice(1)}
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

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <DialogTitle>Konfirmasi Konseling</DialogTitle>
            </div>
          </DialogHeader>

          {selectedSchedule && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {selectedSchedule.siswa.nama.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">
                      {selectedSchedule.siswa.nama}
                    </div>
                    <div className="text-sm text-blue-600">
                      {selectedSchedule.topikKonseling}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-blue-600">
                  Dibuat pada : {selectedSchedule.waktuDiajukan}
                </div>
                <div className="text-sm text-blue-600">
                  Prioritas :{" "}
                  <span className="font-semibold">
                    {selectedSchedule.prioritas.charAt(0).toUpperCase() +
                      selectedSchedule.prioritas.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <Input
                    type="text"
                    value={
                      selectedSchedule.jadwalKonseling?.tanggal ||
                      "Belum dijadwalkan"
                    }
                    disabled
                    className="bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Waktu
                  </label>
                  <Input
                    type="text"
                    value={
                      selectedSchedule.jadwalKonseling?.waktu ||
                      "Belum dijadwalkan"
                    }
                    disabled
                    className="bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Guru BK
                </label>
                <Input
                  value={
                    selectedSchedule.jadwalKonseling?.guruBK ||
                    "Belum ditentukan"
                  }
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Ruangan <span className="text-red-500">*</span>
                </label>
                <Select
                  value={rescheduleData.ruangan}
                  onValueChange={(value) =>
                    setRescheduleData({ ...rescheduleData, ruangan: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ruang BK 1">Ruang BK 1</SelectItem>
                    <SelectItem value="Ruang BK 2">Ruang BK 2</SelectItem>
                    <SelectItem value="Ruang Konseling">
                      Ruang Konseling
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Catatan Konfirmasi (Opsional)
                </label>
                <Textarea
                  value={confirmationData.catatan}
                  onChange={(e) =>
                    setConfirmationData({
                      ...confirmationData,
                      catatan: e.target.value,
                    })
                  }
                  placeholder="Catatan konfirmasi, tindak lanjut"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Batal <X className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={handleSubmitConfirmation}
              disabled={!confirmationData.ruangan}
            >
              Konfirmasi <Check className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              <DialogTitle>Edit Jadwal Konseling</DialogTitle>
            </div>
          </DialogHeader>

          {selectedSchedule && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {selectedSchedule.siswa.nama.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">
                      {selectedSchedule.siswa.nama}
                    </div>
                    <div className="text-sm text-blue-600">
                      {selectedSchedule.topikKonseling}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-blue-600">
                  Dibuat pada : {selectedSchedule.waktuDiajukan}
                </div>
                <div className="text-sm text-blue-600">
                  Prioritas :{" "}
                  <span className="font-semibold">
                    {selectedSchedule.prioritas.charAt(0).toUpperCase() +
                      selectedSchedule.prioritas.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Tanggal Baru <span className="text-red-500">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !rescheduleData.tanggal && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rescheduleData.tanggal ? (
                          format(rescheduleData.tanggal, "dd/MM/yyyy")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={rescheduleData.tanggal}
                        onSelect={(date) =>
                          setRescheduleData({
                            ...rescheduleData,
                            tanggal: date,
                          })
                        }
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Waktu Baru <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={rescheduleData.waktu}
                    onValueChange={(value) =>
                      setRescheduleData({ ...rescheduleData, waktu: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih waktu">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {rescheduleData.waktu || "Pilih waktu"}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="08:30">08:30</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="09:30">09:30</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="10:30">10:30</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="11:30">11:30</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="13:30">13:30</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="14:30">14:30</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="15:30">15:30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Guru BK</label>
                <Select
                  value={rescheduleData.guruBK}
                  onValueChange={(value) =>
                    setRescheduleData({ ...rescheduleData, guruBK: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih guru BK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sri Wahyuni, S.Pd, M.Pd">
                      Sri Wahyuni, S.Pd, M.Pd
                    </SelectItem>
                    <SelectItem value="Ahmad Rizki, S.Pd">
                      Ahmad Rizki, S.Pd
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Ruangan</label>
                <Select
                  value={rescheduleData.ruangan}
                  onValueChange={(value) =>
                    setRescheduleData({ ...rescheduleData, ruangan: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ruang BK 1">Ruang BK 1</SelectItem>
                    <SelectItem value="Ruang BK 2">Ruang BK 2</SelectItem>
                    <SelectItem value="Ruang Konseling">
                      Ruang Konseling
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRescheduleDialogOpen(false)}
            >
              Batal <X className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={handleSubmitReschedule}
              disabled={!rescheduleData.tanggal || !rescheduleData.waktu}
            >
              Simpan <Check className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-green-500" />
              <DialogTitle>Tandai Selesai</DialogTitle>
            </div>
          </DialogHeader>

          {selectedSchedule && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {selectedSchedule.siswa.nama.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">
                      {selectedSchedule.siswa.nama}
                    </div>
                    <div className="text-sm text-blue-600">
                      {selectedSchedule.topikKonseling}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-blue-600">
                  Dibuat pada : {selectedSchedule.waktuDiajukan}
                </div>
                <div className="text-sm text-blue-600">
                  Prioritas :{" "}
                  <span className="font-semibold">
                    {selectedSchedule.prioritas.charAt(0).toUpperCase() +
                      selectedSchedule.prioritas.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Catatan Hasil Konseling{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  placeholder="Tulis hasil konseling, rekomendasi tindak lanjut, dan kesimpulan sesi konseling..."
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 karakter diperlukan untuk menyelesaikan konseling
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCompleteDialogOpen(false)}
            >
              Batal <X className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={handleSubmitCompletion}
              disabled={
                !completionNote.trim() || completionNote.trim().length < 20
              }
            >
              Selesai <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <DialogTitle>Batalkan Jadwal</DialogTitle>
            </div>
          </DialogHeader>

          {selectedSchedule && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {selectedSchedule.siswa.nama.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">
                      {selectedSchedule.siswa.nama}
                    </div>
                    <div className="text-sm text-blue-600">
                      {selectedSchedule.topikKonseling}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-blue-600">
                  Dibuat pada : {selectedSchedule.waktuDiajukan}
                </div>
                <div className="text-sm text-blue-600">
                  Prioritas :{" "}
                  <span className="font-semibold">
                    {selectedSchedule.prioritas.charAt(0).toUpperCase() +
                      selectedSchedule.prioritas.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Alasan Pembatalan <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Alasan pembatan jadwal konseling"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Kembali
            </Button>
            <Button variant="destructive" onClick={handleSubmitCancellation}>
              Batalkan <Check className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
