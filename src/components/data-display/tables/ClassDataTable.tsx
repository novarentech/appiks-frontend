"use client";

import React, { useState, useMemo } from "react";
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
import { Eye, Edit, Trash2, Plus, Search, Home, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Dummy data
const sampleData = [
  {
    id: "1",
    kelas: "X IPA 1",
    sekolah: "Magelang",
    tingkat: "X",
    waktu: "27/08/2025 10:00 AM",
  },
  {
    id: "2",
    kelas: "X IPA 1",
    sekolah: "Magelang",
    tingkat: "X",
    waktu: "27/08/2025 10:00 AM",
  },
  {
    id: "3",
    kelas: "X IPA 1",
    sekolah: "Magelang",
    tingkat: "X",
    waktu: "25/08/2025 10:00 AM",
  },
  {
    id: "4",
    kelas: "X IPA 1",
    sekolah: "Magelang",
    tingkat: "X",
    waktu: "25/08/2025 10:00 AM",
  },
];

export interface ClassItem {
  id: string;
  kelas: string;
  sekolah: string;
  tingkat?: string;
  waktu: string;
}

const SCHOOL_OPTIONS = [
  { value: "Magelang", label: "Magelang" },
  // Tambah sekolah lain jika ada
];

const TINGKAT_OPTIONS = [
  { value: "X", label: "X" },
  { value: "XI", label: "XI" },
  { value: "XII", label: "XII" },
];

export default function ClassDataTable() {
  const [data, setData] = useState<ClassItem[]>(sampleData);
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  // Dialog state
  const [openDialog, setOpenDialog] = useState<null | {
    type: "lihat" | "edit" | "hapus" | "tambah";
    row?: ClassItem;
  }>(null);

  // Form state for tambah/edit
  const [form, setForm] = useState<{
    sekolah?: string;
    kelas?: string;
    tingkat?: string;
  }>({});

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sekolah.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSchool =
        schoolFilter === "all" || item.sekolah === schoolFilter;
      // Status filter dummy, always true
      const matchesStatus = statusFilter === "all" || true;
      return matchesSearch && matchesSchool && matchesStatus;
    });
  }, [data, searchQuery, schoolFilter, statusFilter]);

  // Table columns
  const columns: ColumnDef<ClassItem>[] = [
    {
      accessorKey: "kelas",
      header: "Kelas",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.kelas}</div>
      ),
    },
    {
      accessorKey: "sekolah",
      header: "Sekolah",
      cell: ({ row }) => <div>{row.original.sekolah}</div>,
    },
    {
      accessorKey: "tingkat",
      header: "Tingkat",
      cell: ({ row }) => <div>{row.original.tingkat}</div>,
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
                      setForm({
                        sekolah: item.sekolah,
                        kelas: item.kelas,
                        tingkat: item.tingkat,
                      });
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
                      setForm({
                        sekolah: item.sekolah,
                        kelas: item.kelas,
                        tingkat: item.tingkat,
                      });
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

  // Dialog form handlers
  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTambah = () => {
    try {
      if (!form.sekolah || !form.kelas || !form.tingkat) {
        console.error("Form tidak lengkap. Semua field harus diisi.");
        return;
      }
      const newId = `class-${Date.now()}`;
      const formattedTime = new Date().toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      const newClassItem: ClassItem = {
        id: newId,
        kelas: form.kelas,
        sekolah: form.sekolah,
        tingkat: form.tingkat,
        waktu: formattedTime,
      };
      setData((prev) => [...prev, newClassItem]);
      setForm({});
      setOpenDialog(null);
    } catch (error) {
      console.error("Error saat menambah kelas:", error);
    }
  };

  const handleEdit = () => {
    try {
      if (!openDialog?.row) {
        console.error("Tidak ada data yang dipilih untuk diedit.");
        return;
      }
      if (!form.sekolah || !form.kelas || !form.tingkat) {
        console.error("Form tidak lengkap. Semua field harus diisi.");
        return;
      }
      setData((prev) =>
        prev.map((item) =>
          item.id === openDialog.row!.id
            ? {
                ...item,
                kelas: form.kelas!,
                sekolah: form.sekolah!,
                tingkat: form.tingkat!,
              }
            : item
        )
      );
      setForm({});
      setOpenDialog(null);
    } catch (error) {
      console.error("Error saat mengedit kelas:", error);
    }
  };

  const handleDelete = () => {
    try {
      if (!openDialog?.row) {
        console.error("Tidak ada data yang dipilih untuk dihapus.");
        return;
      }
      setData((prev) => prev.filter((item) => item.id !== openDialog.row!.id));
      setOpenDialog(null);
    } catch (error) {
      console.error("Error saat menghapus kelas:", error);
    }
  };

  function DialogForm({
    type,
    readOnly = false,
  }: {
    type: "tambah" | "edit" | "lihat";
    readOnly?: boolean;
  }) {
    const isTambah = type === "tambah";
    const isEdit = type === "edit";

    return (
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (isTambah) handleTambah();
          if (isEdit) handleEdit();
        }}
      >
        <div className="mb-2">
          <DialogTitle className="flex items-center gap-2 text-xl mb-6">
            {isTambah ? (
              <>
                <Home className="h-6 w-6 text-[#6C63FF]" />
                Tambah Kelas
              </>
            ) : isEdit ? (
              <>
                <Pencil className="h-6 w-6 text-[#6C63FF]" />
                Edit Kelas
              </>
            ) : (
              <>
                <Eye className="h-6 w-6 text-[#6C63FF]" />
                Detail Kelas
              </>
            )}
          </DialogTitle>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Pilih Sekolah
            </label>
            <Select
              value={form.sekolah || ""}
              onValueChange={(v) => handleFormChange("sekolah", v)}
              disabled={readOnly}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Pilih Sekolah" />
              </SelectTrigger>
              <SelectContent>
                {SCHOOL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                Nama Kelas{(isTambah || isEdit) && <span className="text-red-500">*</span>}
              </label>
              <Input
                placeholder="Nama Kelas"
                value={form.kelas || ""}
                onChange={(e) => handleFormChange("kelas", e.target.value)}
                disabled={readOnly}
                className=""
                required={isTambah || isEdit}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                Tingkat{(isTambah || isEdit) && <span className="text-red-500">*</span>}
              </label>
              <Select
                value={form.tingkat || ""}
                onValueChange={(v) => handleFormChange("tingkat", v)}
                disabled={readOnly}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Pilih Tingkat" />
                </SelectTrigger>
                <SelectContent>
                  {TINGKAT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {(isTambah || isEdit) && (
          <DialogFooter className="gap-3 mt-8 ">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
            >
              {isTambah ? (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-1" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </form>
    );
  }

  function DialogLihat() {
    return (
      <div className="w-full">
        <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-[#37364F] mb-6">
          <Eye className="h-7 w-7 text-[#6C63FF]" />
          Detail Kelas
        </DialogTitle>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Sekolah</label>
            <Input value={form.sekolah || ""} disabled className="h-12" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Nama Kelas</label>
              <Input value={form.kelas || ""} disabled className="h-12" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Tingkat</label>
              <Input value={form.tingkat || ""} disabled className="h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function DialogHapus() {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center mb-6">
          <span className="rounded-full bg-[#ffeaea] p-3 mb-2">
            <Trash2 className="w-8 h-8 text-[#FF5A5F]" />
          </span>
          <DialogTitle className="text-2xl font-bold text-center text-[#37364F]">
            Hapus Kelas
          </DialogTitle>
        </div>
        <div className="text-center mb-8">
          <p>
            Yakin ingin menghapus kelas <b>{openDialog?.row?.kelas}</b>?
          </p>
        </div>
        <DialogFooter className="flex flex-row gap-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#6C63FF] text-[#6C63FF] hover:bg-[#f4f4ff]"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="flex-1 bg-[#FF5A5F] hover:bg-[#e14a4e] text-white"
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Controls Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search & Filter */}
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
              <SelectItem value="all">Semua Sekolah</SelectItem>
              {SCHOOL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {/* Tambah status lain jika ada */}
            </SelectContent>
          </Select>
        </div>
        {/* Right: Page size & Tambah Kelas */}
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
            <Plus className="w-4 h-4" /> Tambah Kelas
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        showColumnToggle={false}
        showPagination={true}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        showPageSizeSelector={false}
      />

      {/* Dialogs */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-xl rounded-2xl">
          {openDialog?.type === "tambah" && <DialogForm type="tambah" />}
          {openDialog?.type === "edit" && <DialogForm type="edit" />}
          {openDialog?.type === "lihat" && <DialogLihat />}
          {openDialog?.type === "hapus" && <DialogHapus />}
        </DialogContent>
      </Dialog>
    </div>
  );
}