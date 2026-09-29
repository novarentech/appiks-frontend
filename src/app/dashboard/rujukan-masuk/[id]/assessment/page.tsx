"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPsychologistCounselingRecap } from "@/lib/api";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { ChevronLeft, Eye } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function AssessmentHistoryPage() {
  return (
    <RoleGuard permissionType="rujukan-masuk">
      <AssessmentHistoryContent />
    </RoleGuard>
  );
}

function AssessmentHistoryContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination and Sort states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal states
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(
    null,
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPsychologistCounselingRecap(id);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Gagal memuat data catatan asesmen.");
        toast.error(response.message || "Gagal memuat data catatan asesmen");
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
        <p className="text-gray-600">Memuat catatan asesmen...</p>
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
  const assessments =
    data?.counselings || data?.assessments || data?.records || [];

  // Sort and Pagination logic
  const sortedAssessments = [...assessments].sort((a: any, b: any) => {
    const dateAStr =
      a.created_at || a.scheduled_at || a.date || new Date().toISOString();
    const dateBStr =
      b.created_at || b.scheduled_at || b.date || new Date().toISOString();
    const dateA = new Date(dateAStr).getTime();
    const dateB = new Date(dateBStr).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedAssessments.length / itemsPerPage);
  const currentItems = sortedAssessments.slice(
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

  const getNotes = (item: any) =>
    item.clinical_notes || item.notes || item.catatan || "-";

  return (
    <div className="space-y-6 pb-12 bg-white min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Riwayat Assesment {studentName} Oleh Guru BK
        </h1>
        <p className="text-gray-500 text-sm mt-1">Catatan Hasil Konseling</p>
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
                <ChevronLeft
                  className={`w-3 h-3 inline opacity-50 transition-transform ml-1 ${sortOrder === "asc" ? "rotate-90" : "-rotate-90"}`}
                />
              </TableHead>
              <TableHead className="text-indigo-800 font-semibold h-12">
                Metode Konseling
              </TableHead>
              <TableHead className="text-indigo-800 font-semibold h-12">
                Guru BK
              </TableHead>
              <TableHead className="text-indigo-800 font-semibold h-12">
                Catatan
              </TableHead>
              <TableHead className="text-indigo-800 font-semibold h-12 text-right pr-6">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => {
                const dateRaw =
                  item.created_at ||
                  item.scheduled_at ||
                  item.date ||
                  new Date().toISOString();
                const dateFormatted = format(
                  new Date(dateRaw),
                  "MM/dd/yyyy hh:mm a",
                );
                const method = item.method || item.session_mode || "-";
                const counselorName =
                  item.counselor?.name || item.guru_bk || "Guru BK";
                const notes = getNotes(item);

                return (
                  <TableRow
                    key={item.id || index}
                    className="hover:bg-gray-50/50 transition-colors border-b-gray-100"
                  >
                    <TableCell className="font-medium text-gray-600 py-4 w-[180px]">
                      {dateFormatted}
                    </TableCell>
                    <TableCell className="text-gray-600 py-4 w-[150px]">
                      {method}
                    </TableCell>
                    <TableCell className="text-gray-600 py-4 w-[200px]">
                      {counselorName}
                    </TableCell>
                    <TableCell className="text-gray-500 py-4 max-w-[400px]">
                      <p className="truncate">{notes}</p>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6 w-[100px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-2 h-8"
                        onClick={() => setSelectedAssessment(item)}
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
                  Tidak ada catatan asesmen dari Guru BK
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {assessments.length > 0 && (
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
        open={!!selectedAssessment}
        onOpenChange={(open) => !open && setSelectedAssessment(null)}
      >
        <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <DialogTitle>Detail Catatan Asesmen</DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Guru BK</div>
                  <div className="font-semibold text-gray-900">
                    {selectedAssessment?.counselor?.name ||
                      selectedAssessment?.guru_bk ||
                      "Guru BK"}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">
                    Metode Konseling
                  </div>
                  <div className="font-semibold text-gray-900">
                    {selectedAssessment?.method ||
                      selectedAssessment?.session_mode ||
                      "-"}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">
                  Catatan Hasil Konseling
                </h4>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                  {selectedAssessment ? getNotes(selectedAssessment) : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 pt-4 border-t flex justify-end">
            <Button
              onClick={() => setSelectedAssessment(null)}
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
