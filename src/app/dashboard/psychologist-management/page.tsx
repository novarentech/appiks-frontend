"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, Trash2, Search, Building2 } from "lucide-react";
import { getPsychologists, deletePsychologist } from "@/lib/api";
import { PsychologistData } from "@/types/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function PsychologistManagementPage() {
  return (
    <RoleGuard permissionType="dashboard">
      <PsychologistListContent />
    </RoleGuard>
  );
}

function PsychologistListContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  
  const [data, setData] = useState<PsychologistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item?: PsychologistData }>({ open: false });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      const res = await getPsychologists();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data psikolog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const institutions = useMemo(() => {
    return Array.from(new Set(data.map((p) => p.psychologist_profile?.institution_name).filter(Boolean)));
  }, [data]);

  const filteredPsychologists = useMemo(() => {
    return data.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesInstitution =
        institutionFilter === "all" || p.psychologist_profile?.institution_name === institutionFilter;
      return matchesSearch && matchesInstitution;
    });
  }, [data, searchTerm, institutionFilter]);

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item?.username) return;
    try {
      setDeleteLoading(true);
      const res = await deletePsychologist(deleteDialog.item.username);
      if (res.success) {
        toast.success(res.message || "Psikolog berhasil dihapus");
        setDeleteDialog({ open: false });
        fetchPsychologists();
      } else {
        toast.error(res.message || "Gagal menghapus psikolog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menghapus psikolog");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: ColumnDef<PsychologistData>[] = [
    {
      accessorKey: "name",
      header: "Nama Psikolog",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original.username}</div>,
    },
    {
      accessorKey: "strNumber",
      header: "STR",
      cell: ({ row }) => <div>{row.original.psychologist_profile?.str_number}</div>,
    },
    {
      accessorKey: "institution",
      header: "Institusi",
      cell: ({ row }) => <div>{row.original.psychologist_profile?.institution_name}</div>,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/dashboard/psychologist-management/${item.id}`
                      )
                    }
                    className="h-8 w-8 p-0 bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lihat Detail</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteDialog({ open: true, item })}
                    className="h-8 w-8 p-0 bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hapus</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Psikolog Mitra
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola akun psikolog mitra untuk menerima rujukan siswa
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari nama psikolog..."
              className="pl-9 w-full sm:w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Pilih Instansi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Instansi</SelectItem>
              {institutions.map((inst) => (
                <SelectItem key={inst} value={inst}>
                  {inst}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Baris per halaman:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button asChild className="bg-[#6C63FF] hover:bg-[#554fd8] text-white flex items-center gap-2">
            <Link href="/dashboard/psychologist-management/add">
              <UserPlus className="w-4 h-4" />
              Tambah Psikolog
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#6C63FF]" />
          <span className="ml-2 text-gray-600">Memuat data psikolog...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredPsychologists}
          showColumnToggle={false}
          showPagination={true}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showPageSizeSelector={false}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <svg className="h-6 w-6 text-red-600 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Psikolog Mitra
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Apakah Anda yakin ingin menghapus psikolog{" "}
            <span className="font-semibold">{deleteDialog.item?.name}</span>?
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={deleteLoading}>
                Batal
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
