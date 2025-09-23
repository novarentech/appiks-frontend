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
import { FaWhatsapp } from "react-icons/fa";
import { getDashboardStudent } from "@/lib/api";
import { Student as ApiStudent, DashboardStudentResponse } from "@/types/api";
import { getInitials } from "@/lib/utils";
import Image from "next/image";

interface Student {
  id: number;
  name: string;
  nisn: string;
  kelas: string;
  statusMood: string;
  detailMood: string;
  aksi: string;
  phone: string; // Added for WhatsApp integration
  username: string;
}

interface StudentDataTableProps {
  onStudentSelect?: (student: Student) => void;
}

// Helper functions
const getMoodColor = (mood: string) => {
  switch (mood.toLowerCase()) {
    case "gembira":
      return "text-green-600";
    case "netral":
      return "text-gray-600";
    case "sedih":
      return "text-blue-600";
    case "marah":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getMoodEmoji = (mood: string) => {
  switch (mood.toLowerCase()) {
    case "gembira":
      return "/icon/ico-happy.webp";
    case "netral":
      return "/icon/ico-neutral.webp";
    case "sedih":
      return "/icon/ico-sad.webp";
    case "marah":
      return "/icon/ico-angry.webp";
    default:
      return "/icon/ico-neutral.webp";
  }
};

export default function TeacherStudentData({
}: StudentDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [statusMoodFilter, setStatusMoodFilter] = useState("all");
  const [detailMoodFilter, setDetailMoodFilter] = useState("all");
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
        const transformedData: Student[] = response.data.map(
          (student: ApiStudent, index: number) => {
            const moodStatus = student.lastmoodres?.status || "neutral";
            const isSafeMood =
              moodStatus === "happy" || moodStatus === "neutral";

            return {
              id: index + 1,
              name: student.name,
              nisn: student.identifier,
              kelas: student.room.name,
              statusMood: isSafeMood ? "Aman" : "Tidak Aman",
              detailMood: getMoodLabel(moodStatus),
              aksi: "Lihat Pola Mood",
              phone: student.phone,
              username: student.username,
            };
          }
        );

        setStudentsData(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch student data"
        );
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
  const uniqueStatusMood = [
    ...new Set(studentsData.map((student) => student.statusMood)),
  ];
  const uniqueDetailMood = [
    ...new Set(studentsData.map((student) => student.detailMood)),
  ];

  // Apply filters when filter values change
  useEffect(() => {
    const filtered = studentsData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nisn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesKelas =
        kelasFilter === "all" || student.kelas === kelasFilter;
      const matchesStatusMood =
        statusMoodFilter === "all" || student.statusMood === statusMoodFilter;
      const matchesDetailMood =
        detailMoodFilter === "all" || student.detailMood === detailMoodFilter;

      return (
        matchesSearch && matchesKelas && matchesStatusMood && matchesDetailMood
      );
    });
    setFilteredData(filtered);
  }, [
    searchTerm,
    kelasFilter,
    statusMoodFilter,
    detailMoodFilter,
    studentsData,
  ]);

  // Helper function to get mood label in Indonesian
  const getMoodLabel = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "Gembira";
      case "neutral":
        return "Netral";
      case "sad":
        return "Sedih";
      case "angry":
        return "Marah";
      default:
        return "Netral";
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleKelasFilter = (value: string) => {
    setKelasFilter(value);
  };

  const handleStatusMoodFilter = (value: string) => {
    setStatusMoodFilter(value);
  };

  const handleDetailMoodFilter = (value: string) => {
    setDetailMoodFilter(value);
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
      accessorKey: "statusMood",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Status Mood
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("statusMood") as string;
        return (
          <Badge
            variant={status === "Aman" ? "default" : "destructive"}
            className={
              status === "Aman"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "detailMood",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Detail Mood
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const mood = row.getValue("detailMood") as string;
        return (
          <div className="flex items-center space-x-2">
            <Image
              src={getMoodEmoji(mood)}
              alt={`${mood} icon`}
              width={30}
              height={30}
              className="w-5 h-5"
            />
            <span className={`font-medium ${getMoodColor(mood)}`}>{mood}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const student = row.original;
        const whatsappNumber = formatPhoneForWhatsApp(student.phone);
        return (
          <div className="flex flex-col sm:flex-row gap-2 min-w-[200px]">
            <Button
              variant="default"
              size="sm"
              className="text-white bg-teal-500 hover:bg-teal-600 text-xs px-3 py-1 h-8"
              asChild
            >
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className="flex items-center justify-center"
              >
                <FaWhatsapp className="w-3 h-3 mr-1" />
                Chat WA
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-1 h-8"
            >
              <Link
                href={`/dashboard/mood-detail/${student.username}`}
                className="flex items-center justify-center"
              >
                <Eye className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Lihat Pola Mood</span>
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  // Format phone number for WhatsApp
  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    // If starts with 0, replace with 62
    if (cleaned.startsWith("0")) {
      return `62${cleaned.substring(1)}`;
    }
    // If starts with 62, return as is
    if (cleaned.startsWith("62")) {
      return cleaned;
    }
    // Default case
    return cleaned;
  };

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

          {/* Status Mood Filter */}
          <div className="w-full sm:min-w-[160px] lg:w-[160px]">
            <Select
              value={statusMoodFilter}
              onValueChange={handleStatusMoodFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Status Mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {uniqueStatusMood.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Detail Mood Filter */}
          <div className="w-full sm:min-w-[160px] lg:w-[160px]">
            <Select
              value={detailMoodFilter}
              onValueChange={handleDetailMoodFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Detail Mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mood</SelectItem>
                {uniqueDetailMood.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood}
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
