"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import TeacherStudentData from "@/components/data-display/tables/TeacherStudentData";
import CounselorStudentData from "@/components/data-display/tables/CounselorStudentData";
import TeacherPanel from "@/components/dashboard/panels/TeacherPanel";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMoodRecordExportToday } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface Student {
  id: number;
  name: string;
  nisn: string;
  kelas: string;
  statusMood?: string; // Optional for teacher view
  detailMood?: string; // Optional for teacher view
  noTelp?: string; // Optional for counselor view
  guruWali?: string; // Optional for counselor view
  aksi: string;
}

export default function DashboardDataSiswaPage() {
  return (
    <RoleGuard permissionType="student-data">
      <DashboardDataSiswaPageContent />
    </RoleGuard>
  );
}

function DashboardDataSiswaPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleStudentSelect = (student: Student) => {
    if (user?.role === "teacher") {
      // Navigate to mood pattern page for teachers
      router.push(
        `/dashboard/lihat-pola-mood/${encodeURIComponent(
          student.name.toLowerCase().replace(/\s+/g, "-")
        )}`
      );
    } else if (user?.role === "counselor") {
      router.push(
        `/dashboard/lihat-pola-mood/${encodeURIComponent(
          student.name.toLowerCase().replace(/\s+/g, "-")
        )}`
      );
    }
  };

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      
      // Get the export URL from API
      const response = await getMoodRecordExportToday();
      
      if (response.success && response.data?.url) {
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = response.data.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Extract filename from URL or create a default one
        const urlParts = response.data.url.split('/');
        const filename = urlParts[urlParts.length - 1] || `mood-record-export-${new Date().toISOString().split('T')[0]}.xlsx`;
        
        link.download = filename;
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Laporan berhasil diunduh");
      } else {
        throw new Error(response.message || "Gagal mendapatkan URL export");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error(error instanceof Error ? error.message : "Gagal mengunduh laporan");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold">Data Siswa</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === "teacher"
              ? "Pantau mood siswa, interaksi, dan laporan dengan mudah."
              : "Monitor kondisi emosional siswa dan kelola sesi konseling."}
          </p>
        </div>
        <div className="sm:flex items-center gap-4 mt-4 sm:mt-0">
          <div className="text-sm text-gray-600 bg-gray-100 border py-2.5 px-4 rounded-lg flex items-center mt-4 sm:mt-0">
            <Calendar className="inline mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              month: "long",
              year: "numeric",
              day: "numeric",
            })}
          </div>
          <Button 
            className="mt-4 sm:mt-0 w-full sm:w-auto"
            onClick={handleDownloadReport}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Mengunduh..." : "Cetak Laporan"}
          </Button>
        </div>
      </div>

      {/* Metrics Panel - Different for Teacher and Counselor */}
      {user?.role === "teacher" && <TeacherPanel />}

      {/* Student Data Table */}
      {user?.role === "teacher" ? (
        <TeacherStudentData onStudentSelect={handleStudentSelect} />
      ) : (
        <CounselorStudentData onStudentSelect={handleStudentSelect} />
      )}
    </div>
  );
}
