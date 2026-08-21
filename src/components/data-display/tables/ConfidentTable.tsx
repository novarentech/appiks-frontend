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
import { useState, useEffect, useCallback } from "react";
import { Eye, MessageCircle, ArrowUpDown, Loader2, Search } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Types
import { Sharing } from "@/types/api";
import { getSharingList, replySharing } from "@/lib/api";

interface ConfidentTableProps {
  onResponseSubmit?: (curhatId: number, response: string) => void;
}

export default function ConfidentTable({
  onResponseSubmit,
}: ConfidentTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [curhatData, setCurhatData] = useState<Sharing[]>([]);
  const [filteredData, setFilteredData] = useState<Sharing[]>([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for new status
  const mapPriorityToStatus = (priority: string) => {
    const p = priority?.toLowerCase() || "rendah";
    if (p === "tinggi" || p === "kritis") return "Kritis";
    if (p === "sedang" || p === "prioritas") return "Prioritas";
    return "Aman";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Kritis":
        return "bg-red-100 text-red-800 border-red-200";
      case "Prioritas":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Aman":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApiStatusBadgeVariant = (status: string) => {
    const s = status?.toLowerCase() || "belum ditinjau";
    switch (s) {
      case "belum ditinjau":
      case "belum ditanggapi":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "sedang ditangani":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "konseling dijadwalkan":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "diselesaikan":
        return "bg-green-50 text-green-700 border-green-200";
      case "jadwal ditolak siswa":
        return "bg-red-50 text-red-700 border-red-200";
      case "menunggu persetujuan siswa":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "menunggu persetujuan rujukan":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Fetch data from API
  const fetchCurhatData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSharingList();

      if (result.success) {
        setCurhatData(result.data);
        setFilteredData(result.data);
      } else {
        setError(result.message || "Gagal mengambil data");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // We no longer need inline reply functions since we navigate to detailed page

  // Initialize data
  useEffect(() => {
    fetchCurhatData();
  }, [fetchCurhatData]);

  // Get unique values for filters based on mapped status
  const uniqueStatus = [
    ...new Set(curhatData.map((item) => mapPriorityToStatus(item.priority))),
  ];

  // Apply filters
  useEffect(() => {
    const filtered = curhatData.filter((item) => {
      const matchesSearch =
        (item.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase());

      const mappedStatus = mapPriorityToStatus(item.priority);
      const matchesStatus =
        statusFilter === "all" ||
        mappedStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, curhatData]);

  const handleTinjau = (curhat: Sharing) => {
    router.push(`/dashboard/student-share/${curhat.id}`);
  };

  // Column definitions
  const columns: ColumnDef<Sharing>[] = [
    {
      accessorKey: "user.name",
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
              {getInitials(row.original.user?.name || "Tanpa Nama")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium truncate">
              <p>{row.original.user?.name || "Tanpa Nama"}</p>
            </span>
            <span className="font-mono text-sm">
              {row.original.user.identifier}
            </span>
          </div>
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
          {row.original.user.room?.name || "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "title",
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
        <div className="min-w-[200px] max-w-[200px]">
          <div className="font-medium truncate">{row.original.title}</div>
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Prioritas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const priorityStatus = mapPriorityToStatus(row.original.priority);
        return (
          <Badge className={getStatusBadgeVariant(priorityStatus)}>
            {priorityStatus}
          </Badge>
        );
      },
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
      cell: ({ row }) => {
        const apiStatus = row.original.status || "menunggu";
        return (
          <Badge
            variant="outline"
            className={`capitalize ${getApiStatusBadgeVariant(apiStatus)}`}
          >
            {apiStatus}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
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
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        const formattedDate = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div className="text-sm text-gray-600 min-w-[120px]">
            {formattedDate}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const curhat = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleTinjau(curhat)}
              className="min-w-30 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 h-8 shadow-sm"
            >
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Tinjau
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
                  {status}
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
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
          pageSizeOptions={[5, 10, 15, 25, 50]}
          showPageSizeSelector={false}
        />
      )}
    </div>
  );
}
