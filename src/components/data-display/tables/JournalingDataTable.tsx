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
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Eye, ArrowUpDown, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JournalEntry {
  id: number;
  time: string;
  story: string;
  emosi: string[];
  category: string;
  think: string;
}

interface JournalingDataTableProps {
  onEntrySelect?: (entry: JournalEntry) => void;
}

// Sample local data
const sampleJournalData: JournalEntry[] = [
  {
    id: 1,
    time: "08/27/2025 08:00 AM",
    story:
      "Hari ini aku merasa takut karena beberapa teman menertawakanku saat presentasi di depan kelas. Setelah itu aku jadi sedih dan memilih diam sepanjang pelajaran. Tapi makin lama aku merasa marah, bukan cuma karena mereka mengejek, tapi juga karena aku gak bisa membela diri saat itu.",
    emosi: ["takut", "sedih", "marah"],
    category: "sekolah",
    think: "Aku harap besok aku bisa tampil lagi dengan lebih percaya diri.",
  },
  {
    id: 2,
    time: "08/26/2025 03:30 PM",
    story:
      "Tadi siang ada ulangan matematika dan aku merasa cemas banget. Soal-soalnya susah dan aku gak yakin sama jawabanku. Setelah selesai, aku merasa lega tapi juga sedikit kecewa dengan diriku sendiri.",
    emosi: ["cemas", "lega", "kecewa"],
    category: "akademik",
    think: "Besok harus belajar lebih giat lagi dan jangan mudah panik.",
  },
  {
    id: 3,
    time: "08/25/2025 07:15 PM",
    story:
      "Malam ini aku bertengkar dengan adikku karena masalah sepele. Aku jadi marah dan frustrasi, tapi setelah itu aku merasa bersalah karena sudah keras sama dia. Akhirnya aku minta maaf dan kita baikan lagi.",
    emosi: ["marah", "frustrasi", "bersalah"],
    category: "keluarga",
    think:
      "Harus lebih sabar menghadapi adik dan jangan mudah terpancing emosi.",
  },
  {
    id: 4,
    time: "08/24/2025 02:00 PM",
    story:
      "Hari ini aku dapat nilai bagus untuk tugas bahasa Indonesia. Aku merasa senang dan bangga dengan hasil kerjaku. Teman-teman juga ikut senang dan memuji hasilku. Aku jadi lebih termotivasi untuk belajar.",
    emosi: ["senang", "bangga", "termotivasi"],
    category: "akademik",
    think: "Prestasi ini harus dipertahankan dan ditingkatkan lagi.",
  },
  {
    id: 5,
    time: "08/23/2025 06:45 PM",
    story:
      "Aku merasa sedih hari ini karena sahabatku pindah sekolah. Kami sudah berteman lama dan aku akan merindukannya. Tapi aku juga berharap dia bahagia di sekolah baru dan kita bisa tetap berkomunikasi.",
    emosi: ["sedih", "rindu", "harap"],
    category: "pertemanan",
    think: "Meski berjauhan, persahabatan kita harus tetap dijaga.",
  },
  {
    id: 6,
    time: "08/22/2025 11:30 AM",
    story:
      "Tadi pagi aku terlambat bangun dan langsung buru-buru ke sekolah. Aku merasa panik dan takut telat masuk kelas. Untungnya sampai tepat waktu, tapi aku merasa lelah karena tidak sarapan.",
    emosi: ["panik", "takut", "lelah"],
    category: "sekolah",
    think: "Besok harus bangun lebih pagi dan atur waktu dengan lebih baik.",
  },
  {
    id: 7,
    time: "08/21/2025 04:15 PM",
    story:
      "Aku ikut ekstrakurikuler basket dan hari ini ada pertandingan persahabatan. Aku merasa gugup tapi juga excited. Tim kita menang dan aku mencetak beberapa poin. Aku merasa sangat bahagia dan puas.",
    emosi: ["gugup", "excited", "bahagia", "puas"],
    category: "ekstrakurikuler",
    think: "Latihan keras memang membuahkan hasil, terus semangat!",
  },
  {
    id: 8,
    time: "08/20/2025 08:30 PM",
    story:
      "Aku merasa cemas tentang masa depanku. Apa jurusan yang akan aku pilih nanti? Aku bingung dan takut salah pilih. Tapi aku juga mencoba untuk berpikir positif dan percaya bahwa semuanya akan baik-baik saja.",
    emosi: ["cemas", "bingung", "takut", "positif"],
    category: "pribadi",
    think:
      "Aku harus banyak mencari informasi dan konsultasi dengan orang tua dan guru.",
  },
];

export default function GratitudeDataTable({}: JournalingDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] =
    useState<JournalEntry[]>(sampleJournalData);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Apply search filter when search term changes
  useEffect(() => {
    const filtered = sampleJournalData.filter((entry) => {
      const matchesSearch =
        entry.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.think.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.emosi.some((emosi) =>
          emosi.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesSearch;
    });
    setFilteredData(filtered);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleViewDetail = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  // Column definitions for the data table
  const columns: ColumnDef<JournalEntry>[] = [
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
      accessorKey: "story",
      header: "Preview Hasil",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="text-sm text-gray-700 max-w-sm truncate">
            {entry.story}
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
                <BookOpen className=" text-primary" />
                <DialogTitle>Detail Daily Journaling</DialogTitle>
              </DialogHeader>
              {selectedEntry && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 space-y-4 sm:space-y-0 p-2">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">
                        Kategori
                      </h4>
                      <Badge variant="outline">{selectedEntry.category}</Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">
                        Emosi
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedEntry.emosi.map((emosi, index) => (
                          <Badge key={index} variant="secondary">
                            {emosi}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      Cerita
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry.story}
                    </p>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      Pemikiran
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry.think}
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
            placeholder="Cari cerita, emosi, atau pemikiran..."
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
