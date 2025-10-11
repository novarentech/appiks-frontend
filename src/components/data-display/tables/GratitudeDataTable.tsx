"use client";

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
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Eye, ArrowUpDown, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GratitudeEntry {
  id: number;
  time: string;
  improvement: string[];
  achivement: string;
  appreciate: string;
}

interface GratitudeDataTableProps {
  onEntrySelect?: (entry: GratitudeEntry) => void;
}

// Sample local data
const sampleGratitudeData: GratitudeEntry[] = [
  {
    id: 1,
    time: "08/27/2025 08:00 AM",
    improvement: [
      "Aku berani berbicara meskipun gugup.",
      "Aku menyiapkan materi dengan baik sejak kemarin.",
      "Aku tidak menyerah meskipun sempat salah saat menjelaskan."
    ],
    achivement: "Aku akhirnya berani presentasi di depan kelas.",
    appreciate: "Hari ini, aku bangga pada diriku karena aku berani mencoba dan tidak takut gagal."
  },
  {
    id: 2,
    time: "08/26/2025 03:30 PM",
    improvement: [
      "Aku belajar dengan disiplin setiap hari.",
      "Aku bertanya kepada guru saat tidak mengerti.",
      "Aku mengerjakan latihan soal secara rutin."
    ],
    achivement: "Aku mendapatkan nilai A untuk ulangan matematika.",
    appreciate: "Aku bersyukur atas kerja kerasku dan bantuan dari teman-teman yang sudah membantu belajar."
  },
  {
    id: 3,
    time: "08/25/2025 07:15 PM",
    improvement: [
      "Aku mencoba mengontrol emosiku saat marah.",
      "Aku mau mendengarkan pendapat adikku.",
      "Aku yang memulai untuk minta maaf terlebih dahulu."
    ],
    achivement: "Aku berhasil menyelesaikan konflik dengan adikku dengan baik.",
    appreciate: "Aku menghargai proses belajarku untuk menjadi kakak yang lebih baik."
  },
  {
    id: 4,
    time: "08/24/2025 02:00 PM",
    improvement: [
      "Aku menulis dengan lebih terstruktur.",
      "Aku melakukan riset untuk mendukung argumen ku.",
      "Aku meminta masukan kepada teman sebelum mengumpulkan."
    ],
    achivement: "Tugas bahasa Indonesiaku dipuji oleh guru dan menjadi contoh di kelas.",
    appreciate: "Aku bangga dengan hasil kerjaku dan termotivasi untuk terus berkembang."
  },
  {
    id: 5,
    time: "08/23/2025 06:45 PM",
    improvement: [
      "Aku berani mengungkapkan perasaanku secara jujur.",
      "Aku mendukung keputusan sahabatku.",
      "Aku berjanji untuk tetap menjaga komunikasi."
    ],
    achivement: "Aku bisa melepas kepergian sahabatku dengan hati yang ikhlas.",
    appreciate: "Aku bersyukur memiliki persahabatan yang indah dan pengalaman berharga selama ini."
  },
  {
    id: 6,
    time: "08/22/2025 11:30 AM",
    improvement: [
      "Aku mulai belajar untuk bangun lebih pagi.",
      "Aku menyiapkan keperluan sekolah dari malam sebelumnya.",
      "Aku mengatur waktu dengan lebih baik."
    ],
    achivement: "Aku berhasil sampai di sekolah tepat waktu dan siap mengikuti pelajaran.",
    appreciate: "Aku menghargai usaha kecilku untuk menjadi lebih disiplin."
  },
  {
    id: 7,
    time: "08/21/2025 04:15 PM",
    improvement: [
      "Aku rajin mengikuti latihan basket.",
      "Aku bekerja sama dengan tim dengan baik.",
      "Aku tidak mudah menyerah saat pertandingan sulit."
    ],
    achivement: "Aku berkontribusi dalam kemenangan tim basket sekolah.",
    appreciate: "Aku bersyukur bisa menjadi bagian dari tim yang solid dan penuh semangat."
  },
  {
    id: 8,
    time: "08/20/2025 08:30 PM",
    improvement: [
      "Aku mulai mencari informasi tentang berbagai jurusan.",
      "Aku diskusi dengan orang tua tentang masa depan.",
      "Aku mencoba untuk berpikir positif dan percaya diri."
    ],
    achivement: "Aku mulai memiliki gambaran yang lebih jelas tentang arah masa depanku.",
    appreciate: "Aku menghargai proses pencarian jati diri dan dukungan dari keluarga."
  }
];

export default function GratitudeDataTable({}: GratitudeDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] =
    useState<GratitudeEntry[]>(sampleGratitudeData);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [selectedEntry, setSelectedEntry] = useState<GratitudeEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Apply search filter when search term changes
  useEffect(() => {
    const filtered = sampleGratitudeData.filter((entry) => {
      const matchesSearch =
        entry.achivement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.appreciate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.improvement.some((imp) =>
          imp.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesSearch;
    });
    setFilteredData(filtered);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleViewDetail = (entry: GratitudeEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  // Column definitions for the data table
  const columns: ColumnDef<GratitudeEntry>[] = [
    {
      accessorKey: "time",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Waktu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="text-sm text-gray-900 font-medium min-w-[120px]">
            {entry.time}
          </div>
        );
      },
    },
    {
      accessorKey: "improvement",
      header: "Preview Hasil",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="text-sm text-gray-700 max-w-sm truncate">
            {entry.improvement.join(", ")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <Dialog
            open={isDialogOpen && selectedEntry?.id === entry.id}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setSelectedEntry(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-1 h-8"
                onClick={() => handleViewDetail(entry)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Lihat Detail
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="items-center flex flex-row mb-4">
                <Heart className=" text-primary" />
                <DialogTitle>Detail Gratitude Journal</DialogTitle>
              </DialogHeader>
              {selectedEntry && (
                <div className="space-y-4">
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      Pencapaian
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry.achivement}
                    </p>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      Perbaikan Diri
                    </h4>
                    <ol className="list-decimal pl-5 text-sm text-gray-900 leading-relaxed space-y-1">
                      {selectedEntry.improvement.map((imp, index) => (
                        <li key={index} className="">
                          {imp}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      Apresiasi Diri
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry.appreciate}
                    </p>
                  </div>
                </div>
              )}
              <DialogFooter className="mt-4">
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedEntry(null);
                  }}
                >
                  Tutup
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls Layout */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Cari pencapaian, apresiasi, atau perbaikan diri..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
            <SelectTrigger className="w-[80px] sm:w-[80px]">
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
    </div>
  );
}
