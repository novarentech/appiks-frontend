"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, Trash2, Search, Building2 } from "lucide-react";
import { mockPsychologists } from "@/data/mockPsychologists";
import { Psychologist } from "@/types/psychologist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

  const institutions = useMemo(() => {
    return Array.from(new Set(mockPsychologists.map((p) => p.institution)));
  }, []);

  const filteredPsychologists = useMemo(() => {
    return mockPsychologists.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesInstitution =
        institutionFilter === "all" || p.institution === institutionFilter;
      return matchesSearch && matchesInstitution;
    });
  }, [searchTerm, institutionFilter]);

  const columns: ColumnDef<Psychologist>[] = [
    {
      accessorKey: "name",
      header: "Nama Psikolog",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "strNumber",
      header: "STR",
      cell: ({ row }) => <div>{row.original.strNumber}</div>,
    },
    {
      accessorKey: "institution",
      header: "Institusi",
      cell: ({ row }) => <div>{row.original.institution}</div>,
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

      <DataTable
        columns={columns}
        data={filteredPsychologists}
        showColumnToggle={false}
        showPagination={true}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        showPageSizeSelector={false}
      />
    </div>
  );
}
