"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import CurhatReplyDialog from "@/components/dialogs/CurhatReplyDialog";
import CurhatViewDialog from "@/components/dialogs/CurhatViewDialog";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Eye, MessageCircle, ArrowUpDown } from "lucide-react";

// Types
interface Curhat {
  id: number;
  siswa: {
    nama: string;
    nisn: string;
    kelas: string;
  };
  judul: string;
  deskripsi: string;
  status: "terkirim" | "dibalas";
  prioritas: "rendah" | "sedang" | "tinggi";
  waktuDibuat: string;
  balasan?: string;
  waktuDibalas?: string;
}

// Sample data
const curhatData: Curhat[] = [
  {
    id: 1,
    siswa: {
      nama: "Alex Allan",
      nisn: "THD-64651",
      kelas: "X IPA 1",
    },
    judul: "Masalah Dengan Teman Sekelas",
    deskripsi:
      "Saya merasa dikucilkan oleh teman-teman sekelas. Mereka sering berbisik-bisik ketika saya lewat dan tidak pernah mengajak saya bergabung dalam kegiatan kelompok.",
    status: "dibalas",
    prioritas: "tinggi",
    waktuDibuat: "27/08/2025 08:00",
    balasan:
      "Terima kasih sudah berani bercerita dan terbuka tentang perasaanmu. Saya bisa memahami bahwa merasa dikucilkan pasti tidak nyaman dan membuat sedih. Kamu tidak sendirian menghadapi hal ini.\n\nLangkah pertama, mari kita coba pahami situasinya lebih dalam: kapan biasanya teman-temanmu bersikap seperti itu, dan bagaimana perasaanmu saat mengalaminya? Dari ceritamu, nanti kita bisa cari cara bersama agar kamu tetap merasa nyaman di kelas.\n\nKamu juga berhak untuk punya teman dan dilibatkan dalam kegiatan kelompok. Kita akan bahas strategi supaya kamu bisa lebih percaya diri berinteraksi, dan bila perlu saya juga bisa membantu mengomunikasikan hal ini ke guru wali kelas atau teman-temanmu secara bijaksana.",
    waktuDibalas: "27/08/2025 14:30",
  },
  {
    id: 2,
    siswa: {
      nama: "Anna Vincenti",
      nisn: "WTC-78415",
      kelas: "X IPA 1",
    },
    judul: "Kesulitan Belajar Matematika",
    deskripsi:
      "Saya sudah berusaha keras tapi nilai matematika saya selalu jelek. Saya takut tidak bisa naik kelas dan mengecewakan orang tua.",
    status: "terkirim",
    prioritas: "sedang",
    waktuDibuat: "26/08/2025 15:30",
  },
  {
    id: 3,
    siswa: {
      nama: "David Kim",
      nisn: "MBQ-39617",
      kelas: "X IPA 2",
    },
    judul: "Masalah Keluarga di Rumah",
    deskripsi:
      "Orang tua saya sering bertengkar dan saya merasa tertekan. Saya tidak bisa konsentrasi belajar karena situasi di rumah yang tidak kondusif.",
    status: "terkirim",
    prioritas: "tinggi",
    waktuDibuat: "25/08/2025 20:15",
  },
  {
    id: 4,
    siswa: {
      nama: "Falon Al-Sayed",
      nisn: "XCU-35036",
      kelas: "XI IPS 1",
    },
    judul: "Kecemasan Menghadapi Ujian",
    deskripsi:
      "Setiap kali ada ujian, saya merasa sangat cemas dan panik. Tangan saya berkeringat dan pikiran jadi kosong saat mengerjakan soal.",
    status: "dibalas",
    prioritas: "sedang",
    waktuDibuat: "24/08/2025 10:00",
    balasan:
      "Kecemasan ujian adalah hal yang wajar dialami banyak siswa. Mari kita cari teknik relaksasi dan persiapan yang tepat untuk membantumu menghadapi ujian dengan lebih tenang.",
    waktuDibalas: "24/08/2025 16:45",
  },
  {
    id: 5,
    siswa: {
      nama: "Hiroshi Yamamoto",
      nisn: "LZN-37419",
      kelas: "XI IPS 1",
    },
    judul: "Bullying di Sekolah",
    deskripsi:
      "Saya sering dibully oleh kakak kelas. Mereka meminta uang jajan saya dan mengancam akan menyakiti saya jika saya tidak memberikannya.",
    status: "terkirim",
    prioritas: "tinggi",
    waktuDibuat: "23/08/2025 07:45",
  },
];

interface ConfidentTableProps {
  onResponseSubmit?: (curhatId: number, response: string) => void;
}

export default function ConfidentTable({
  onResponseSubmit,
}: ConfidentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [prioritasFilter, setPrioritasFilter] = useState("all");
  const [filteredData, setFilteredData] = useState(curhatData);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  // Dialog states
  const [selectedCurhat, setSelectedCurhat] = useState<Curhat | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Get unique values for filters
  const uniqueStatus = [...new Set(curhatData.map((item) => item.status))];
  const uniquePrioritas = [
    ...new Set(curhatData.map((item) => item.prioritas)),
  ];

  // Apply filters
  useEffect(() => {
    const filtered = curhatData.filter((item) => {
      const matchesSearch =
        item.siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.siswa.nisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.judul.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesPrioritas =
        prioritasFilter === "all" || item.prioritas === prioritasFilter;

      return matchesSearch && matchesStatus && matchesPrioritas;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, prioritasFilter]);

  // Helper functions
  const getStatusBadge = (status: string) => {
    const variants = {
      terkirim: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dibalas: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
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

  const handleReply = (curhat: Curhat) => {
    setSelectedCurhat(curhat);
    setIsReplyDialogOpen(true);
  };

  const handleView = (curhat: Curhat) => {
    setSelectedCurhat(curhat);
    setIsViewDialogOpen(true);
  };

  // Column definitions
  const columns: ColumnDef<Curhat>[] = [
    {
      accessorKey: "siswa.nama",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Nama Siswa
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
          <span className="font-medium truncate">
            {row.original.siswa.nama}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "siswa.nisn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          NISN
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[120px]">
          <span className="font-mono text-sm">{row.original.siswa.nisn}</span>
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
      accessorKey: "judul",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Curhatan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[200px] max-w-[300px]">
          <div className="font-medium truncate">{row.original.judul}</div>
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
            {row.original.status === "terkirim" ? "Terkirim" : "Dibalas"}
          </Badge>
          <Badge className={getPrioritasBadge(row.original.prioritas)}>
            {row.original.prioritas.charAt(0).toUpperCase() +
              row.original.prioritas.slice(1)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "waktuDibuat",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Waktu Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 min-w-[120px]">
          {row.original.waktuDibuat}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const curhat = row.original;
        return (
          <div className="flex gap-2">
            {curhat.status === "terkirim" ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleReply(curhat)}
                className="min-w-30 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-8"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Balas
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleView(curhat)}
                className="min-w-30 text-green-600 border-green-200 hover:bg-green-50 text-xs px-3 py-1 h-8"
              >
                <Eye className="w-3 h-3 mr-1" />
                Lihat Balasan
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari nama siswa, NISN, atau judul curhatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {uniqueStatus.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "terkirim" ? "Terkirim" : "Dibalas"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={prioritasFilter} onValueChange={setPrioritasFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter Prioritas" />
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

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap hidden sm:block">
              Tampilkan:
            </span>
            <Select
              value={currentPageSize.toString()}
              onValueChange={(value) => setCurrentPageSize(Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
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
        pageSizeOptions={[5, 10, 15, 25, 50]}
        showPageSizeSelector={false}
      />

      {/* Dialogs */}
      <CurhatReplyDialog
        curhat={selectedCurhat}
        isOpen={isReplyDialogOpen}
        onClose={() => setIsReplyDialogOpen(false)}
        onSubmit={onResponseSubmit || (() => {})}
      />

      <CurhatViewDialog
        curhat={selectedCurhat}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </div>
  );
}
