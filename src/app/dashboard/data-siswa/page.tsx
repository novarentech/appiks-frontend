"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TeacherStudentData from "@/components/data-display/tables/TeacherStudentData";
import CounselorStudentData from "@/components/data-display/tables/CounselorStudentData";
import TeacherPanel from "@/components/dashboard/panels/TeacherPanel";

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
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && !["teacher", "counselor"].includes(user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, isAuthenticated, isVerified, user, router]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !isVerified ||
    !user ||
    !["teacher", "counselor"].includes(user.role)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Siswa</h1>
        <p className="text-gray-600 mt-2">
          {user.role === "teacher"
            ? "Pantau mood siswa, interaksi, dan laporan dengan mudah."
            : "Monitor kondisi emosional siswa dan kelola sesi konseling."}
        </p>
      </div>

      {/* Metrics Panel - Different for Teacher and Counselor */}
      {user.role === "teacher" && <TeacherPanel />}

      {/* Student Data Table */}
      {user.role === "teacher" ? (
        <TeacherStudentData onStudentSelect={handleStudentSelect} />
      ) : (
        <CounselorStudentData onStudentSelect={handleStudentSelect} />
      )}
    </div>
  );
}
