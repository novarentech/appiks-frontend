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
import { Eye, ArrowUpDown, Wind } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SensoryEntry {
  id: number;
  time: string;
  Aktivitas: string[];
  Refleksi: string;
}

interface SensoryDataTableProps {
  onEntrySelect?: (entry: SensoryEntry) => void;
}

// Sample local data
const sampleSensoryData: SensoryEntry[] = [
  {
    id: 1,
    time: "08/27/2025 08:00 AM",
    Aktivitas: [
      "Cuci tangan dengan air mengalir",
      "Mandi air dingin (saat merasa jenuh dan butuh segar) atau",
      "Mandi air hangat (saat merasa sangat lelah, frustasi dan membutuhkan fokus ketenangan)"
    ],
    Refleksi: "aku merasa lebih tenang dan segar juga emosi lebih stabil"
  },
  {
    id: 2,
    time: "08/26/2025 03:30 PM",
    Aktivitas: [
      "Berjalan kaki di taman sambil merasakan angin",
      "Menyentuh daun dan bunga dengan lembut",
      "Duduk di rumput sambil merasakan teksturnya"
    ],
    Refleksi: "aku merasa terhubung dengan alam dan lebih rileks"
  },
  {
    id: 3,
    time: "08/25/2025 07:15 PM",
    Aktivitas: [
      "Menggosok badan dengan handuk kasar",
      "Minum teh hangat sambil merasakan hangatnya",
      "Mendengarkan suara hujan di jendela"
    ],
    Refleksi: "aku merasa nyaman dan lebih siap untuk tidur"
  },
  {
    id: 4,
    time: "08/24/2025 02:00 PM",
    Aktivitas: [
      "Memegang es batu dengan telapak tangan",
      "Mencelupkan kaki ke air dingin",
      "Menghirup aroma peppermint oil"
    ],
    Refleksi: "aku merasa segar dan fokus kembali setelah lelah belajar"
  },
  {
    id: 5,
    time: "08/23/2025 06:45 PM",
    Aktivitas: [
      "Memijat bahu dengan lembut",
      "Menggosok punggung dengan sikat lembut",
      "Mengenakan pakaian yang nyaman dan lembut"
    ],
    Refleksi: "aku merasa relaks dan tegangku berkurang"
  },
  {
    id: 6,
    time: "08/22/2025 11:30 AM",
    Aktivitas: [
      "Mencium aroma kopi segar",
      "Merasakan tekstur biji kopi",
      "Menikmati hangatnya cangkir kopi"
    ],
    Refleksi: "aku merasa berenergi dan siap untuk memulai hari"
  },
  {
    id: 7,
    time: "08/21/2025 04:15 PM",
    Aktivitas: [
      "Menggosok telapak kaki di karpet",
      "Memegang bantal lembut",
      "Merasakan selimut hangat"
    ],
    Refleksi: "aku merasa aman dan nyaman di ruanganku"
  },
  {
    id: 8,
    time: "08/20/2025 08:30 PM",
    Aktivitas: [
      "Mencuci muka dengan air dingin",
      "Mengaplikasikan pelembap wajah",
      "Merasakan tekstur handuk lembut di wajah"
    ],
    Refleksi: "aku merasa segar dan siap untuk tidur nyenyak"
  }
];

export default function SensoryDataTable({}: SensoryDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] =
    useState<SensoryEntry[]>(sampleSensoryData);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [selectedEntry, setSelectedEntry] = useState<SensoryEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Apply search filter when search term changes
  useEffect(() => {
    const filtered = sampleSensoryData.filter((entry) => {
      const matchesSearch =
        entry.Aktivitas.some((aktivitas) =>
          aktivitas.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        entry.Refleksi.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
    setFilteredData(filtered);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleViewDetail = (entry: SensoryEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  // Column definitions for the data table
  const columns: ColumnDef<SensoryEntry>[] = [
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
      accessorKey: "Aktivitas",
      header: "Preview Hasil",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="text-sm text-gray-700 max-w-sm truncate">
            {entry.Aktivitas.join(", ")}
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
                <Wind className=" text-primary" />
                <DialogTitle>Detail Sensory Relaxation</DialogTitle>
              </DialogHeader>
              {selectedEntry && (
                <div className="space-y-4">
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      Aktivitas
                    </h4>
                    <ul className="text-sm text-gray-900 leading-relaxed space-y-1">
                      {selectedEntry.Aktivitas.map((aktivitas, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1 h-1 bg-gray-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {aktivitas}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      Refleksi
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry.Refleksi}
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
            placeholder="Cari aktivitas atau refleksi..."
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
