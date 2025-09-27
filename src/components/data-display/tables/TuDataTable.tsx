"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Eye, Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { getUsersByType } from "@/lib/api";
import { User } from "@/types/api";
import TuDialogForms from "./TuDialogForms";

// Function to map API User data to TuAdmin interface
function mapUserToTuAdmin(user: User): TuAdmin {
  return {
    id: user.id?.toString() || "",
    username: user.username,
    sekolah: user.room?.name || "Unknown",
    kontak: user.phone,
    waktu: user.created_at ? new Date(user.created_at).toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }) : new Date().toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    email: user.username + "@example.com", // Generate email since API doesn't provide it
    nama: user.name,
    nip: user.identifier,
    telepon: user.phone,
  };
}

export interface TuAdmin {
  id: string;
  username: string;
  sekolah: string;
  kontak: string;
  waktu: string;
  email: string;
  nama: string;
  nip: string;
  telepon: string;
}

export default function TuDataTable() {
  const [data, setData] = useState<TuAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  // Fetch admin users data
  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUsersByType("admin");
        if (response.success && response.data) {
          const mappedData = response.data.map(mapUserToTuAdmin);
          setData(mappedData);
        } else {
          setError(response.message || "Failed to fetch admin users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUsers();
  }, []);

  // Dialog state
  const [openDialog, setOpenDialog] = useState<null | {
    type: "lihat" | "edit" | "hapus" | "tambah";
    row?: TuAdmin;
  }>(null);

  // Form state
  const [, setForm] = useState<Partial<TuAdmin>>({});

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nama.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSchool =
        schoolFilter === "all" || item.sekolah === schoolFilter;
      return matchesSearch && matchesSchool;
    });
  }, [data, searchQuery, schoolFilter]);

  // Get unique schools for filter dropdown
  const uniqueSchools = useMemo(() => {
    const schools = [...new Set(data.map(item => item.sekolah))];
    return schools.length > 0 
      ? [{ value: "all", label: "Pilih Sekolah" }, ...schools.map(school => ({ value: school, label: school }))]
      : [{ value: "all", label: "Pilih Sekolah" }];
  }, [data]);

  // Table columns
  const columns: ColumnDef<TuAdmin>[] = [
    {
      accessorKey: "name",
      header: "Nama TU",
      cell: ({ row }) => <div className="font-medium">{row.original.nama}</div>,
    },
    {
      accessorKey: "username",
      header: "Akun TU",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.username}</div>
      ),
    },
    {
      accessorKey: "sekolah",
      header: "Nama Sekolah",
      cell: ({ row }) => <div>{row.original.sekolah}</div>,
    },
    {
      accessorKey: "kontak",
      header: "Kontak",
      cell: ({ row }) => <div>{row.original.kontak}</div>,
    },
    {
      accessorKey: "waktu",
      header: "Waktu Dibuat",
      cell: ({ row }) => <div>{row.original.waktu}</div>,
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
                    onClick={() => {
                      setOpenDialog({ type: "lihat", row: item });
                      setForm(item);
                    }}
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
                    onClick={() => {
                      setOpenDialog({ type: "edit", row: item });
                      setForm(item);
                    }}
                    className="h-8 w-8 p-0 bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenDialog({ type: "hapus", row: item })}
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

  // Handle form submission from dialog - now receives form data
  const handleTambah = useCallback((formData: Partial<TuAdmin>) => {
    const newId = `tu-${Date.now()}`;
    const formattedTime = new Date().toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    setData((prev) => [
      ...prev,
      {
        id: newId,
        username: formData.username!,
        sekolah: formData.sekolah!,
        kontak: formData.telepon!,
        waktu: formattedTime,
        email: formData.email!,
        nama: formData.nama!,
        nip: formData.nip!,
        telepon: formData.telepon!,
      },
    ]);
    setOpenDialog(null);
  }, []);

  const handleEdit = useCallback((formData: Partial<TuAdmin>) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === formData.id
          ? {
              ...item,
              username: formData.username!,
              sekolah: formData.sekolah!,
              kontak: formData.telepon!,
              waktu: item.waktu,
              email: formData.email!,
              nama: formData.nama!,
              nip: formData.nip!,
              telepon: formData.telepon!,
            }
          : item
      )
    );
    setOpenDialog(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (!openDialog?.row?.id) return;
    setData((prev) => prev.filter((item) => item.id !== openDialog.row!.id));
    setForm({});
    setOpenDialog(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog?.row?.id]);

  return (
    <div className="w-full space-y-6">
      {/* Controls Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-48"
            />
          </div>
          <Select value={schoolFilter} onValueChange={setSchoolFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Pilih Sekolah" />
            </SelectTrigger>
            <SelectContent>
              {uniqueSchools.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
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

          <Button
            onClick={() => {
              setOpenDialog({ type: "tambah" });
              setForm({});
            }}
            className="bg-[#6C63FF] hover:bg-[#554fd8] text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah TU
          </Button>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#6C63FF]" />
          <span className="ml-2 text-gray-600">Memuat data admin TU...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">Error: {error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="text-[#6C63FF] border-[#6C63FF]"
          >
            Coba Lagi
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          showColumnToggle={false}
          showPagination={true}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showPageSizeSelector={false}
        />
      )}

      {/* Dialogs */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <TuDialogForms
            openDialog={openDialog}
            onTambah={handleTambah}
            onEdit={handleEdit}
            onDelete={handleDelete}
            setOpenDialog={setOpenDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
