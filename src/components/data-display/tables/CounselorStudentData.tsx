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
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Eye, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { getDashboardStudent } from "@/lib/api";
import { Student as ApiStudent, DashboardStudentResponse } from "@/types/api";
import { getInitials } from "@/lib/utils";

interface Student {
  id: number;
  name: string;
  nisn: string;
  kelas: string;
  noTelp: string;
  guruWali: string;
  aksi: string;
  username: string;
}

interface StudentDataTableProps {
  onStudentSelect?: (student: Student) => void;
}

export default function CounselorStudentData({
  onStudentSelect,
}: StudentDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [guruWaliFilter, setGuruWaliFilter] = useState("all");
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  // Fetch data from API
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setLoading(true);
        const response: DashboardStudentResponse = await getDashboardStudent();
        
        // Transform API data to component format
        const transformedData: Student[] = response.data.map((student: ApiStudent, index: number) => {
          return {
            id: index + 1,
            name: student.name,
            nisn: student.identifier,
            kelas: student.room.name,
            noTelp: student.phone,
            guruWali: student.mentor.name,
            aksi: "Lihat Pola Mood",
            username: student.username,
          };
        });
        
        setStudentsData(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, []);

  // Get unique values for filter options
  const uniqueKelas = [
    ...new Set(studentsData.map((student) => student.kelas)),
  ];
  const uniqueGuruWali = [
    ...new Set(studentsData.map((student) => student.guruWali)),
  ];

  // Apply filters when filter values change
  useEffect(() => {
    const filtered = studentsData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nisn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesKelas =
        kelasFilter === "all" || student.kelas === kelasFilter;
      const matchesGuruWali =
        guruWaliFilter === "all" || student.guruWali === guruWaliFilter;

      return matchesSearch && matchesKelas && matchesGuruWali;
    });
    setFilteredData(filtered);
  }, [searchTerm, kelasFilter, guruWaliFilter, studentsData]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleKelasFilter = (value: string) => {
    setKelasFilter(value);
  };

  const handleGuruWaliFilter = (value: string) => {
    setGuruWaliFilter(value);
  };

  // Column definitions for the data table
  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Nama
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center space-x-3 min-w-[150px]">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-blue-600">
                {getInitials(student.name)}
              </span>
            </div>
            <span className="font-medium text-gray-900 truncate">
              {student.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "nisn",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            NISN
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span className="text-gray-600">{row.getValue("nisn")}</span>;
      },
    },
    {
      accessorKey: "kelas",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Kelas
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {row.getValue("kelas")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "noTelp",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            No. Telp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="text-gray-600 font-mono text-sm">
            {row.getValue("noTelp")}
          </span>
        );
      },
    },
    {
      accessorKey: "guruWali",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Guru Wali
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="text-gray-700 font-medium">
            {row.getValue("guruWali")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-1 h-8"
            asChild
          >
            <Link href={`/dashboard/mood-detail/${student.username}`}>
              <Eye className="w-3 h-3 mr-1" />
              Lihat Pola Mood
            </Link>
          </Button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Memuat data siswa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls - Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Cari nama atau NISN siswa..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filter Dropdowns and Page Size */}
        <div className="flex flex-col sm:flex-row lg:flex-nowrap gap-2 lg:gap-3">
          {/* Kelas Filter */}
          <div className="w-full sm:min-w-[160px] lg:w-[160px]">
            <Select value={kelasFilter} onValueChange={handleKelasFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {uniqueKelas.map((kelas) => (
                  <SelectItem key={kelas} value={kelas}>
                    {kelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guru Wali Filter */}
          <div className="w-full sm:min-w-[160px] lg:w-[160px]">
            <Select value={guruWaliFilter} onValueChange={handleGuruWaliFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Guru Wali" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Guru Wali</SelectItem>
                {uniqueGuruWali.map((guru) => (
                  <SelectItem key={guru} value={guru}>
                    {guru}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto lg:w-auto">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap hidden sm:block">
              Tampilkan:
            </span>
            <span className="text-sm font-medium text-gray-600 sm:hidden">
              Per halaman:
            </span>
            <Select
              value={currentPageSize.toString()}
              onValueChange={(value) => setCurrentPageSize(Number(value))}
            >
              <SelectTrigger className="w-[80px] sm:w-[80px] lg:w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchColumn=""
        searchPlaceholder=""
        showColumnToggle={false}
        showPagination={true}
        pageSize={currentPageSize}
        pageSizeOptions={[5, 10, 15, 20, 25, 50]}
        showPageSizeSelector={false}
      />
    </div>
  );
}
