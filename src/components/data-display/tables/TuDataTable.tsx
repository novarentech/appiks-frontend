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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getUsersByType, deleteUser, createAdmin, getSchools, updateUser } from "@/lib/api";
import { User, School } from "@/types/api";
import TuDialogForms from "./TuDialogForms";
import { toast } from "sonner";

// Function to map API User data to TuAdmin interface
function mapUserToTuAdmin(user: User): TuAdmin {
  // Remove +62 prefix from phone number for form display
  const cleanPhone = user.phone ? user.phone.replace(/^62/, "") : "";
  
  return {
    id: user.id?.toString() || "",
    username: user.username,
    sekolah: user.school?.name || "Unknown",
    kontak: user.phone,
    waktu: user.created_at
      ? new Date(user.created_at).toLocaleString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    email: user.username + "@example.com", // Generate email since API doesn't provide it
    nama: user.name,
    nip: user.identifier,
    telepon: cleanPhone,
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
  password?: string;
}

export default function TuDataTable() {
  const [data, setData] = useState<TuAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
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

  // Fetch schools data
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await getSchools();
        if (response.success && response.data) {
          setSchools(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch schools:", err);
      }
    };

    fetchSchools();
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
    const schools = [...new Set(data.map((item) => item.sekolah))];
    return schools.length > 0
      ? [
          { value: "all", label: "Pilih Sekolah" },
          ...schools.map((school) => ({ value: school, label: school })),
        ]
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
  const handleTambah = useCallback(async (formData: Partial<TuAdmin>) => {
    try {
      setAddLoading(true);
      
      // Find the school ID from the school name
      const selectedSchool = schools.find((school: School) => school.name === formData.sekolah);
      if (!selectedSchool) {
        toast.error("Sekolah tidak ditemukan!");
        return;
      }

      // Prepare data for API call
      const apiData = {
        name: formData.nama!,
        phone: `62${formData.telepon!}`, // Add +62 prefix
        username: formData.username!,
        identifier: formData.nip!,
        school_id: selectedSchool.id,
        password: formData.password!,
      };

      // Call API to create admin
      const response = await createAdmin(apiData);
      
      if (response.success) {
        // Refresh the data from API to get the updated list
        const adminResponse = await getUsersByType("admin");
        if (adminResponse.success && adminResponse.data) {
          const mappedData = adminResponse.data.map(mapUserToTuAdmin);
          setData(mappedData);
        }
        setOpenDialog(null);
        toast.success("Admin TU berhasil ditambahkan!");
      } else {
        toast.error(response.message || "Gagal menambah admin TU");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat menambah admin TU");
    } finally {
      setAddLoading(false);
    }
  }, [schools]);

  const handleEdit = useCallback(async (formData: Partial<TuAdmin>) => {
    try {
      // Find the school ID from the school name
      const selectedSchool = schools.find((school: School) => school.name === formData.sekolah);
      if (!selectedSchool) {
        toast.error("Sekolah tidak ditemukan!");
        return;
      }

      // Prepare data for API call
      const apiData = {
        name: formData.nama!,
        phone: `62${formData.telepon!}`, // Add +62 prefix
        username: formData.username!,
        identifier: formData.nip!,
        school_id: selectedSchool.id,
        password: formData.password || null, // Include password if provided
      };

      // Call API to update admin
      const response = await updateUser(formData.username!, apiData);
      
      if (response.success) {
        // Refresh the data from API to get the updated list
        const adminResponse = await getUsersByType("admin");
        if (adminResponse.success && adminResponse.data) {
          const mappedData = adminResponse.data.map(mapUserToTuAdmin);
          setData(mappedData);
        }
        setOpenDialog(null);
        toast.success("Admin TU berhasil diperbarui!");
      } else {
        toast.error(response.message || "Gagal mengedit admin TU");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat mengedit admin TU");
    }
  }, [schools]);

  const handleDelete = useCallback(async () => {
    if (!openDialog?.row?.username) return;
    
    try {
      setDeleteLoading(true);
      const response = await deleteUser(openDialog.row.username);
      
      if (response.success) {
        setData((prev) => prev.filter((item) => item.username !== openDialog.row!.username));
        setForm({});
        setOpenDialog(null);
        toast.success("Admin TU berhasil dihapus!");
      } else {
        toast.error(response.message || "Gagal menghapus admin TU");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus admin TU");
    } finally {
      setDeleteLoading(false);
    }
  }, [openDialog]);

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
            deleteLoading={deleteLoading}
            addLoading={addLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
