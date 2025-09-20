"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MoodPatternAnalysis from "@/components/features/analysis/MoodPatternAnalysis";

// Sample students data to find the selected student
const studentsData = [
  {
    id: 1,
    name: "Alex Allan",
    nisn: "THD-64651",
    kelas: "X IPA 1",
    statusMood: "Aman",
    detailMood: "Gembira",
    aksi: "Lihat Pola Mood",
  },
  {
    id: 2,
    name: "Anna Vincenti",
    nisn: "WTC-78415",
    kelas: "X IPA 1",
    statusMood: "Aman",
    detailMood: "Gembira",
    aksi: "Lihat Pola Mood",
  },
  {
    id: 3,
    name: "Astrid Andersen",
    nisn: "FHW-65127",
    kelas: "X IPA 1",
    statusMood: "Aman",
    detailMood: "Netral",
    aksi: "Lihat Pola Mood",
  },
  {
    id: 4,
    name: "David Kim",
    nisn: "MBQ-39617",
    kelas: "X IPA 1",
    statusMood: "Aman",
    detailMood: "Gembira",
    aksi: "Lihat Pola Mood",
  },
  {
    id: 5,
    name: "Diego Mendoza",
    nisn: "ZWP-45885",
    kelas: "X IPA 1",
    statusMood: "Tidak Aman",
    detailMood: "Sedih",
    aksi: "Lihat Pola Mood",
  },
  {
    id: 6,
    name: "Falon Al-Sayed",
    nisn: "XCU-35036",
    kelas: "X IPA 1",
    statusMood: "Aman",
    detailMood: "Gembira",
    aksi: "Lihat Pola Mood",
  },
  {
    id: 7,
    name: "Hiroshi Yamamoto",
    nisn: "LZN-37419",
    kelas: "X IPA 1",
    statusMood: "Tidak Aman",
    detailMood: "Marah",
    aksi: "Lihat Pola Mood",
  },
  {
    id: 8,
    name: "Lena Müller",
    nisn: "MHY-52314",
    kelas: "X IPA 1",
    statusMood: "Aman",
    detailMood: "Netral",
    aksi: "Lihat Pola Mood",
  },
];

interface Student {
  id: number;
  name: string;
  nisn: string;
  kelas: string;
  statusMood: string;
  detailMood: string;
  aksi: string;
}

export default function DashboardLihatPolaMoodPage() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && user.role !== "teacher" && user.role !== "counselor") {
      router.push("/dashboard");
      return;
    }

    // Find student based on URL parameter
    if (params.siswa) {
      const studentSlug = Array.isArray(params.siswa)
        ? params.siswa[0]
        : params.siswa;
      const decodedName = decodeURIComponent(studentSlug).replace(/-/g, " ");

      const student = studentsData.find(
        (s) => s.name.toLowerCase() === decodedName.toLowerCase()
      );

      if (student) {
        setSelectedStudent(student);
      } else {
        // If student not found, redirect back to data-siswa
        router.push("/dashboard/data-siswa");
      }
    }
  }, [isLoading, isAuthenticated, isVerified, user, router, params.siswa]);

  const handleBackToDataSiswa = () => {
    router.push("/dashboard/data-siswa");
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

  if (!isAuthenticated || !isVerified || !user || (user.role !== "teacher" && user.role !== "counselor")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Student not found. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={handleBackToDataSiswa}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Siswa</span>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">
          Analisis Pola Mood - {selectedStudent.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Detail analisis pola mood dan rekomendasi untuk {selectedStudent.name}{" "}
          ({selectedStudent.kelas})
        </p>
      </div>

      {/* Mood Pattern Analysis */}
      <MoodPatternAnalysis selectedStudent={selectedStudent} />
    </div>
  );
}
