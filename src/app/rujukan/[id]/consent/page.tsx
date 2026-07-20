"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReferralById, updateReferralStatus } from "@/lib/mockReferralData";
import { ReferralNotification } from "@/types/notifications";

export default function ConsentPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [referral, setReferral] = useState<ReferralNotification | null>(null);

  useEffect(() => {
    if (id) {
      const data = getReferralById(id);
      if (data) {
        setReferral(data);
      } else {
        router.push("/notifications");
      }
    }
  }, [id, router]);

  if (!referral) return null;

  const handleApprove = () => {
    // Update status to waiting for schedule
    updateReferralStatus(id, "menunggu_konfirmasi", "Menunggu Konfirmasi", "yellow", "border-yellow-400");
    router.push(`/rujukan/${id}/consent/success`);
  };

  const handleReject = () => {
    updateReferralStatus(id, "dibatalkan", "Dibatalkan", "red", "border-red-400");
    router.push(`/rujukan/${id}/consent/failed`);
  };

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group mb-8"
        onClick={() => router.back()}
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Kembali
      </Button>

      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 relative">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Persetujuan Akses Data
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Untuk melanjutkan rujukan konseling, berikut data yang Anda izinkan untuk dibagikan kepada psikolog mitra.
          </p>
        </div>

        {/* Doctor Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">{referral.psychologist}</h3>
            <p className="text-sm text-blue-600">{referral.location}</p>
          </div>
        </div>

        {/* Data Sharing Info */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Data yang Akan Dibagikan
          </h2>
          <p className="text-sm text-gray-500">
            Dengan menyetujui consent ini, data di bawah akan dibagikan dan dapat diakses oleh psikolog untuk mendukung proses konseling.
          </p>
        </div>

        {/* List of Data */}
        <div className="space-y-3 mb-8">
          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 bg-gray-50/50">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Riwayat mood 30 hari terakhir</h4>
              <p className="text-xs text-gray-500 mt-1">Data aktivitas dan pola mood Anda dalam 30 hari terakhir</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 bg-gray-50/50">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Kutipan teks curhat yang memicu Red Zone</h4>
              <p className="text-xs text-gray-500 mt-1">Teks curhat yang terdeteksi memerlukan perhatian khusus (disamarkan)</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 bg-gray-50/50">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Catatan asesmen Guru BK</h4>
              <p className="text-xs text-gray-500 mt-1">Catatan dan asesmen dari Guru BK sekolah</p>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            Data yang Anda bagikan akan digunakan untuk di berikan ke psikolog sebagai screening.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-6 rounded-xl"
            onClick={handleApprove}
          >
            Setuju dan Lanjutkan
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-medium py-6 rounded-xl"
            onClick={handleReject}
          >
            Tidak Setuju
          </Button>
        </div>
      </div>
    </div>
  );
}
