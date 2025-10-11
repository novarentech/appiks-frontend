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
import { Eye, ArrowUpDown, Brain } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GroundingEntry {
  id: number;
  time: string;
  "5_hal_yang_dilihat": string[];
  "4_hal_yang_disentuh": string[];
  "3_hal_yang_bisa_didengar": string[];
  "2_hal_yang_bisa_dicium": string[];
  "1_hal_yang_bisa_dirasakan": string[];
}

interface GroundingDataTableProps {
  onEntrySelect?: (entry: GroundingEntry) => void;
}

// Sample local data
const sampleGroundingData: GroundingEntry[] = [
  {
    id: 1,
    time: "08/27/2025 08:00 AM",
    "5_hal_yang_dilihat": ["papan tulis", "buku", "pensil", "tas", "jendela"],
    "4_hal_yang_disentuh": ["meja", "kursi", "kain seragam", "rambut"],
    "3_hal_yang_bisa_didengar": [
      "suara AC",
      "langkah kaki",
      "suara teman berbicara",
    ],
    "2_hal_yang_bisa_dicium": ["aroma ruangan", "parfum teman"],
    "1_hal_yang_bisa_dirasakan": ["rasa permen mint"],
  },
  {
    id: 2,
    time: "08/26/2025 03:30 PM",
    "5_hal_yang_dilihat": [
      "layar laptop",
      "cangkir kopi",
      "buku catatan",
      "tanaman hias",
      "jam dinding",
    ],
    "4_hal_yang_disentuh": ["keyboard laptop", "mouse", "gelas", "meja kayu"],
    "3_hal_yang_bisa_didengar": [
      "ketikan keyboard",
      "suara kipas",
      "deru kendaraan",
    ],
    "2_hal_yang_bisa_dicium": ["aroma kopi", "bau kertas"],
    "1_hal_yang_bisa_dirasakan": ["hangatnya cangkir"],
  },
  {
    id: 3,
    time: "08/25/2025 07:15 PM",
    "5_hal_yang_dilihat": ["TV", "sofa", "meja kopi", "lampu tidur", "bantal"],
    "4_hal_yang_disentuh": ["selimut", "remote TV", "dinding", "lantai karpet"],
    "3_hal_yang_bisa_didengar": ["suara TV", "denting jam", "angin di luar"],
    "2_hal_yang_bisa_dicium": ["aroma lavender", "bau makanan"],
    "1_hal_yang_bisa_dirasakan": ["kenyamanan sofa"],
  },
  {
    id: 4,
    time: "08/24/2025 02:00 PM",
    "5_hal_yang_dilihat": ["pohon", "langit biru", "awan", "burung", "rumput"],
    "4_hal_yang_disentuh": ["rumput", "batu", "kulit pohon", "angin"],
    "3_hal_yang_bisa_didengar": ["kicau burung", "desau angin", "suara jauh"],
    "2_hal_yang_bisa_dicium": ["aroma tanah", "bau bunga"],
    "1_hal_yang_bisa_dirasakan": ["hangatnya matahari"],
  },
  {
    id: 5,
    time: "08/23/2025 06:45 PM",
    "5_hal_yang_dilihat": ["kompor", "panci", "sayuran", "pisau", "piring"],
    "4_hal_yang_disentuh": [
      "handle panci",
      "sayuran",
      "meja dapur",
      "air keran",
    ],
    "3_hal_yang_bisa_didengar": [
      "suara menumis",
      "rebusan air",
      "buka tutup kulkas",
    ],
    "2_hal_yang_bisa_dicium": ["aroma masakan", "bau sayuran segar"],
    "1_hal_yang_bisa_dirasakan": ["panasnya kompor"],
  },
  {
    id: 6,
    time: "08/22/2025 11:30 AM",
    "5_hal_yang_dilihat": [
      "spidol",
      "kertas putih",
      "penggaris",
      "penghapus",
      "meja belajar",
    ],
    "4_hal_yang_disentuh": ["spidol", "kertas", "penggaris", "permukaan meja"],
    "3_hal_yang_bisa_didengar": ["suara spidol", "napasku", "suara dari luar"],
    "2_hal_yang_bisa_dicium": ["bau spidol", "bau kertas"],
    "1_hal_yang_bisa_dirasakan": ["tekanan spidol"],
  },
  {
    id: 7,
    time: "08/21/2025 04:15 PM",
    "5_hal_yang_dilihat": [
      "sepatu",
      "kaos kaki",
      "air mineral",
      "handuk",
      "lantai kamar mandi",
    ],
    "4_hal_yang_disentuh": [
      "sepatu",
      "kaos kaki",
      "botol air",
      "lantai keramik",
    ],
    "3_hal_yang_bisa_didengar": ["suara keran", "tetesan air", "langkah kaki"],
    "2_hal_yang_bisa_dicium": ["bau sabun", "aroma air mineral"],
    "1_hal_yang_bisa_dirasakan": ["dinginnya air"],
  },
  {
    id: 8,
    time: "08/20/2025 08:30 PM",
    "5_hal_yang_dilihat": [
      "buku novel",
      "lampu baca",
      "kacamata",
      "bookmark",
      "meja nakas",
    ],
    "4_hal_yang_disentuh": [
      "halaman buku",
      "cover buku",
      "kacamata",
      "selimut",
    ],
    "3_hal_yang_bisa_didengar": [
      "suara halaman dibalik",
      "denting jam",
      "suara hujan",
    ],
    "2_hal_yang_bisa_dicium": ["bau kertas buku", "aroma lavender"],
    "1_hal_yang_bisa_dirasakan": ["tekstur kertas"],
  },
];

export default function GroundingDataTable({}: GroundingDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] =
    useState<GroundingEntry[]>(sampleGroundingData);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [selectedEntry, setSelectedEntry] = useState<GroundingEntry | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Apply search filter when search term changes
  useEffect(() => {
    const filtered = sampleGroundingData.filter((entry) => {
      const matchesSearch =
        entry["5_hal_yang_dilihat"].some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        entry["4_hal_yang_disentuh"].some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        entry["3_hal_yang_bisa_didengar"].some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        entry["2_hal_yang_bisa_dicium"].some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        entry["1_hal_yang_bisa_dirasakan"].some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesSearch;
    });
    setFilteredData(filtered);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleViewDetail = (entry: GroundingEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  // Column definitions for the data table
  const columns: ColumnDef<GroundingEntry>[] = [
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
      accessorKey: "5_hal_yang_dilihat",
      header: "Preview Hasil",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="text-sm text-gray-700 max-w-sm truncate">
            {entry["5_hal_yang_dilihat"].join(", ")}
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
                <Brain className=" text-primary" />
                <DialogTitle>Detail Grounding Technique</DialogTitle>
              </DialogHeader>
              {selectedEntry && (
                <div className="space-y-4">
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      5 Hal yang Dilihat
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry["5_hal_yang_dilihat"].join(", ")}
                    </p>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      4 Hal yang Disentuh
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry["4_hal_yang_disentuh"].join(", ")}
                    </p>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      3 Hal yang Bisa Didengar
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry["3_hal_yang_bisa_didengar"].join(", ")}
                    </p>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      2 Hal yang Bisa Dicium
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry["2_hal_yang_bisa_dicium"].join(", ")}
                    </p>
                  </div>
                  <div className="p-2 bg-accent rounded-sm">
                    <h4 className="font-semibold text-sm mb-1">
                      1 Hal yang Bisa Dirasakan
                    </h4>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedEntry["1_hal_yang_bisa_dirasakan"].join(", ")}
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
            placeholder="Cari hal yang dilihat, disentuh, didengar, dicium, atau dirasakan..."
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
