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
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Dummy data sekolah
const sekolahOptions = [
  { value: "all", label: "Pilih Sekolah" },
  { value: "SMA 01 Solo", label: "SMA 01 Solo" },
  { value: "Magelang", label: "Magelang" },
];

// Dummy data TU
const sampleData = [
  {
    id: "1",
    username: "budi_TU",
    sekolah: "SMA 01 Solo",
    kontak: "0981234",
    waktu: "27/08/2025 10:00 AM",
    email: "budi@tu.com",
    nama: "Budi Santoso",
    nip: "1234567890",
    telepon: "0981234",
  },
  {
    id: "2",
    username: "bagus_TU",
    sekolah: "Magelang",
    kontak: "0791234",
    waktu: "27/08/2025 10:00 AM",
    email: "bagus@tu.com",
    nama: "Bagus Prakoso",
    nip: "2345678901",
    telepon: "0791234",
  },
  {
    id: "3",
    username: "karina_TU",
    sekolah: "Magelang",
    kontak: "0182234",
    waktu: "27/08/2025 10:00 AM",
    email: "karina@tu.com",
    nama: "Karina Dewi",
    nip: "3456789012",
    telepon: "0182234",
  },
  {
    id: "4",
    username: "amel_TU",
    sekolah: "Magelang",
    kontak: "2543623",
    waktu: "27/08/2025 10:00 AM",
    email: "amel@tu.com",
    nama: "Amel Sari",
    nip: "4567890123",
    telepon: "2543623",
  },
  {
    id: "5",
    username: "hadi_TU",
    sekolah: "Magelang",
    kontak: "2134567",
    waktu: "27/08/2025 10:00 AM",
    email: "hadi@tu.com",
    nama: "Hadi Pratama",
    nip: "5678901234",
    telepon: "2134567",
  },
  {
    id: "6",
    username: "ani_TU",
    sekolah: "Magelang",
    kontak: "123456",
    waktu: "27/08/2025 10:00 AM",
    email: "ani@tu.com",
    nama: "Ani Lestari",
    nip: "6789012345",
    telepon: "123456",
  },
  {
    id: "7",
    username: "ari_TU",
    sekolah: "Magelang",
    kontak: "654321",
    waktu: "27/08/2025 10:00 AM",
    email: "ari@tu.com",
    nama: "Ari Wibowo",
    nip: "7890123456",
    telepon: "654321",
  },
];

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
  const [data, setData] = useState<TuAdmin[]>(sampleData);
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  // Dialog state
  const [openDialog, setOpenDialog] = useState<null | {
    type: "lihat" | "edit" | "hapus" | "tambah";
    row?: TuAdmin;
  }>(null);

  // Form state
  const [form, setForm] = useState<Partial<TuAdmin>>({});

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sekolah.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSchool =
        schoolFilter === "all" || item.sekolah === schoolFilter;
      return matchesSearch && matchesSchool;
    });
  }, [data, searchQuery, schoolFilter]);

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

  // Dialog form handlers
  const handleFormChange = (field: keyof TuAdmin, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTambah = () => {
    if (
      !form.sekolah ||
      !form.username ||
      !form.email ||
      !form.nama ||
      !form.nip ||
      !form.telepon
    ) {
      alert("Semua field wajib diisi!");
      return;
    }
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
        username: form.username!,
        sekolah: form.sekolah!,
        kontak: form.telepon!,
        waktu: formattedTime,
        email: form.email!,
        nama: form.nama!,
        nip: form.nip!,
        telepon: form.telepon!,
      },
    ]);
    setForm({});
    setOpenDialog(null);
  };

  const handleEdit = () => {
    if (
      !form.sekolah ||
      !form.username ||
      !form.email ||
      !form.nama ||
      !form.nip ||
      !form.telepon ||
      !form.id
    ) {
      alert("Semua field wajib diisi!");
      return;
    }
    setData((prev) =>
      prev.map((item) =>
        item.id === form.id
          ? {
              ...item,
              username: form.username!,
              sekolah: form.sekolah!,
              kontak: form.telepon!,
              waktu: item.waktu,
              email: form.email!,
              nama: form.nama!,
              nip: form.nip!,
              telepon: form.telepon!,
            }
          : item
      )
    );
    setForm({});
    setOpenDialog(null);
  };

  const handleDelete = () => {
    if (!openDialog?.row?.id) return;
    setData((prev) => prev.filter((item) => item.id !== openDialog.row!.id));
    setForm({});
    setOpenDialog(null);
  };

  function DialogForm({
    type,
    readOnly = false,
  }: {
    type: "tambah" | "edit" | "lihat";
    readOnly?: boolean;
  }) {
    return (
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (type === "tambah") handleTambah();
          if (type === "edit") handleEdit();
        }}
      >
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {type === "tambah" ? (
              <>
              <Plus className="h-6 w-6 text-[#6C63FF]" />
              Tambah Admin TU
              </>
            ) : type === "edit" ? (
              <>
              <Edit className="h-6 w-6 text-[#6C63FF]" />
              Edit Admin TU
              </>
            ) : (
              <>
              <Eye className="h-6 w-6 text-[#6C63FF]" />
              Detail Admin TU
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
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
                {sekolahOptions
                  .filter((opt) => opt.value !== "all")
                  .map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Username<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Username untuk login"
                value={form.username || ""}
                onChange={(e) => handleFormChange("username", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Email Akun TU"
                value={form.email || ""}
                onChange={(e) => handleFormChange("email", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Lengkap<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nama Lengkap Staff TU"
                value={form.nama || ""}
                onChange={(e) => handleFormChange("nama", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                NIP/NUPTK<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nomor Indentitas Pegawai"
                value={form.nip || ""}
                onChange={(e) => handleFormChange("nip", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Telepon<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="No Telepon"
                value={form.telepon || ""}
                onChange={(e) => handleFormChange("telepon", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4 border-t gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          {type !== "lihat" && (
            <Button
              type="submit"
              className="bg-[#6C63FF] hover:bg-[#554fd8] text-white flex items-center gap-2"
            >
              {type === "tambah" ? (
                <>
                  Tambah <Plus className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Simpan <Edit className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </form>
    );
  }

  function DialogDelete() {
    return (
      <div>
        <DialogHeader>
          <DialogTitle>
            <Trash2 className="h-6 w-6 text-red-600 inline-block mr-2" />
            Hapus Admin TU
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Apakah Anda yakin ingin menghapus admin TU{" "}
          <span className="font-semibold">{openDialog?.row?.username}</span>?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
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
              {sekolahOptions.map((opt) => (
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
        <DialogContent className="max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {openDialog?.type === "tambah" && <DialogForm type="tambah" />}
          {openDialog?.type === "edit" && <DialogForm type="edit" />}
          {openDialog?.type === "lihat" && (
            <DialogForm type="lihat" readOnly={true} />
          )}
          {openDialog?.type === "hapus" && <DialogDelete />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
