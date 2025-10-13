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
import { getSelfHelpData } from "@/lib/api";
import { SelfHelpResponse, SensoryRelaxationContent } from "@/types/api";

interface SensoryEntry {
  id: number;
  time: string;
  Aktivitas: string[];
  Refleksi: string;
}

interface SensoryDataTableProps {
  username: string;
  onEntrySelect?: (entry: SensoryEntry) => void;
}

// Transform API data to SensoryEntry format
function transformApiDataToSensoryEntries(apiData: SelfHelpResponse): SensoryEntry[] {
  if (!apiData.success || !apiData.data) {
    return [];
  }

  return apiData.data
    .filter(item => item.type === "Sensory Relaxation")
    .map(item => {
      const content = item.content as SensoryRelaxationContent;
      return {
        id: item.id,
        time: new Date(item.created_at).toLocaleString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '/'),
        Aktivitas: content.activity,
        Refleksi: content.reflection
      };
    })
    .reverse(); // Show newest entries first
}

export default function SensoryDataTable({ username }: SensoryDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState<SensoryEntry[]>([]);
  const [filteredData, setFilteredData] = useState<SensoryEntry[]>([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [selectedEntry, setSelectedEntry] = useState<SensoryEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSelfHelpData("Sensory Relaxation", username);
        const transformedData = transformApiDataToSensoryEntries(response);
        setApiData(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setApiData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  // Apply search filter when search term or API data changes
  useEffect(() => {
    const filtered = apiData.filter((entry) => {
      const matchesSearch =
        entry.Aktivitas.some((aktivitas) =>
          aktivitas.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        entry.Refleksi.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
    setFilteredData(filtered);
  }, [searchTerm, apiData]);

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
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">Memuat data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const fetchData = async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    const response = await getSelfHelpData("Sensory Relaxation", username);
                    const transformedData = transformApiDataToSensoryEntries(response);
                    setApiData(transformedData);
                    setFilteredData(transformedData);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to fetch data");
                    setApiData([]);
                    setFilteredData([]);
                  } finally {
                    setLoading(false);
                  }
                };
                fetchData();
              }}
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredData.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">Tidak ada data Sensory Relaxation yang tersedia.</p>
          </div>
        </div>
      )}

      {/* Controls Layout */}
      {!loading && !error && filteredData.length > 0 && (
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
      )}

      {/* Data Table */}
      {!loading && !error && filteredData.length > 0 && (
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
    </div>
  );
}
