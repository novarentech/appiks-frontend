"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import TeacherStudentData from "@/components/data-display/tables/TeacherStudentData";
import CounselorStudentData from "@/components/data-display/tables/CounselorStudentData";
import TeacherPanel from "@/components/dashboard/panels/TeacherPanel";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

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

  const handleStudentSelect = (student: Student) => {
    if (user?.role === "teacher") {
      // Navigate to mood pattern page for teachers
      router.push(
        `/dashboard/lihat-pola-mood/${encodeURIComponent(
          student.name.toLowerCase().replace(/\s+/g, "-")
        )}`
      );
    } else if (user?.role === "counselor") {
      // Navigate to counseling session or student profile for counselors
      // For now, also navigate to mood pattern, but could be different route
      router.push(
        `/dashboard/lihat-pola-mood/${encodeURIComponent(
          student.name.toLowerCase().replace(/\s+/g, "-")
        )}`
      );
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Data Siswa"
        subtitle={
          user?.role === "teacher"
            ? "Pantau mood siswa, interaksi, dan laporan dengan mudah."
            : "Monitor kondisi emosional siswa dan kelola sesi konseling."
        }
      />

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
