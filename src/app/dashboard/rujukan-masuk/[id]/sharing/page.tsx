"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPsychologistSharingRecap } from "@/lib/api";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { ChevronLeft, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function SharingHistoryPage() {
  return (
    <RoleGuard permissionType="rujukan-masuk">
      <SharingHistoryContent />
    </RoleGuard>
  );
}

function SharingHistoryContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination and Sort states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Based on screenshot showing ~8 items
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal states
  const [selectedSharing, setSelectedSharing] = useState<any | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPsychologistSharingRecap(id);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Gagal memuat data riwayat curhat.");
        toast.error(response.message || "Gagal memuat data riwayat curhat");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data.");
      console.error(err);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Memuat riwayat curhat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchData}>Coba Lagi</Button>
      </div>
    );
  }

  const studentName = data?.student?.name || "Siswa";
  const sharings = data?.sharings || [];

  // Sort and Pagination logic
  const sortedSharings = [...sharings].sort((a: any, b: any) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedSharings.length / itemsPerPage);
  const currentItems = sortedSharings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getZoneBadgeVariant = (zone: string) => {
    if (zone === "Red Zone") {
      return "bg-red-50 text-red-500 border-red-100";
    } else if (zone === "Yellow Zone") {
      return "bg-orange-50 text-orange-500 border-orange-100";
    }
    return "bg-green-50 text-green-500 border-green-100";
  };

  const getZoneLabel = (zone: string) => {
    if (zone === "Red Zone") return "Kritis";
    if (zone === "Yellow Zone") return "Prioritas";
    return "Aman";
  };

  return (
    <div className="space-y-6 pb-12 bg-white min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Riwayat Curhat {studentName}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Riwayat Curhat {studentName} dalam 30 hari
        </p>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-indigo-50/50">
            <TableRow className="border-b-indigo-100/50">
              <TableHead 
                className="text-indigo-800 font-semibold h-12 cursor-pointer hover:bg-indigo-100/50 transition-colors select-none w-[200px]"
                onClick={handleSortToggle}
              >
                Waktu Dibuat{" "}
                <ChevronLeft className={`w-3 h-3 inline opacity-50 transition-transform ml-1 ${sortOrder === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
              </TableHead>
              <TableHead className="text-indigo-800 font-semibold h-12">
                Zona Risiko
              </TableHead>
              <TableHead className="text-indigo-800 font-semibold h-12">
                Transkrip Curhatan
              </TableHead>
              <TableHead className="text-indigo-800 font-semibold h-12">
                Kata Kunci
              </TableHead>
              <TableHead className="text-indigo-800 font-semibold h-12 text-right pr-6">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any) => {
                const zone = item.nlp?.response?.zone_status || "No Trigger";
                const keywords =
                  item.nlp?.response?.matched_keywords?.map((k: any) =>
                    typeof k === "string" ? k : k.stem,
                  ) || [];
                const dateFormatted = format(
                  new Date(item.created_at),
                  "MM/dd/yyyy hh:mm a",
                );

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors border-b-gray-100"
                  >
                    <TableCell className="font-medium text-gray-600 py-4 w-[180px]">
                      {dateFormatted}
                    </TableCell>
                    <TableCell className="py-4 w-[120px]">
                      <Badge
                        variant="outline"
                        className={`${getZoneBadgeVariant(zone)} font-normal px-3 py-0.5`}
                      >
                        {getZoneLabel(zone)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 py-4 max-w-[300px]">
                      <p className="truncate">{item.description}</p>
                    </TableCell>
                    <TableCell className="py-4 max-w-[250px]">
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.length > 0 ? (
                          keywords.map((kw: string, i: number) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-red-50 text-red-400 border-red-100 font-normal px-2 text-[11px] whitespace-nowrap"
                            >
                              {kw}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6 w-[100px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-2 h-8"
                        onClick={() => setSelectedSharing(item)}
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        Lihat
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-gray-500"
                >
                  Tidak ada data riwayat curhat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {sharings.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <span className="text-sm text-gray-500 font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium h-9 px-4"
              >
                Previous
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium h-9 px-6"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedSharing}
        onOpenChange={(open) => !open && setSelectedSharing(null)}
      >
        <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <div className="flex items-center gap-2">
              <DialogTitle>Transkrip Curhatan</DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg">
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap p-4">
                {selectedSharing?.description}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 pt-4 border-t flex justify-end">
            <Button
              onClick={() => setSelectedSharing(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
