"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Users } from "lucide-react";
import { getRoomByCode } from "@/lib/api";
import { RoomDetailResponse, RoomStudent } from "@/types/api";
import Link from "next/link";

interface ClassDetailTableProps {
  roomCode: string;
}

export default function ClassDetailTable({ roomCode }: ClassDetailTableProps) {
  const [roomData, setRoomData] = useState<RoomDetailResponse["data"] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Fetch room data
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRoomByCode(roomCode);

        if (response.success) {
          setRoomData(response.data);
        } else {
          setError("Gagal memuat data kelas. Silakan coba lagi.");
        }
      } catch (err) {
        setError("Gagal memuat data kelas. Silakan coba lagi.");
        console.error("Error fetching room data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (roomCode) {
      fetchRoomData();
    }
  }, [roomCode]);

  // Filter students based on search and verification status
  const filteredStudents = useMemo(() => {
    if (!roomData?.students) return [];

    return roomData.students.filter((student: RoomStudent) => {
      const matchSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.username.toLowerCase().includes(search.toLowerCase()) ||
        student.identifier.toLowerCase().includes(search.toLowerCase()) ||
        (student.mentor?.name || "").toLowerCase().includes(search.toLowerCase());

      return matchSearch;
    });
  }, [roomData?.students, search]);

  const columns: ColumnDef<RoomStudent>[] = [
    {
      accessorKey: "name",
      header: "Nama Siswa",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "identifier",
      header: "NISN",
    },
    {
      accessorKey: "phone",
      header: "No. Telepon",
      cell: ({ row }) => <span>{row.original.phone}</span>,
    },
    {
      accessorKey: "mentor",
      header: "Guru Wali",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.mentor?.name || "-"}</span>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="min-w-30 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-1 h-8"
            >
              <Link
                href={`/dashboard/school-monitor/${roomData?.school.name}/${roomData?.code}/${row.original.username}`}
                className="flex items-center"
              >
                <Eye className="w-3 h-3 mr-1" />
                Pantau Siswa
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
          <p className="mt-4 text-gray-600">Memuat data siswa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Room Info Header */}
      {roomData && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {roomData.mention}
              </h1>
              <p className="text-gray-600">{roomData.school.name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{roomData.students_count} Siswa</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Kode: {roomData.code}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Tingkat:</span>
              <span className="ml-2 text-gray-900">{roomData.level}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Sekolah:</span>
              <span className="ml-2 text-gray-900">{roomData.school.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Lokasi:</span>
              <span className="ml-2 text-gray-900">
                {roomData.school.district}, {roomData.school.city}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Controls Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Cari siswa berdasarkan nama, username, NIS, atau guru wali..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96"
          />
        </div>
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
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        searchPlaceholder="Cari Siswa..."
        searchColumn={undefined}
        showColumnToggle={false}
        showPagination={true}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        showPageSizeSelector={false}
      />
    </div>
  );
}
