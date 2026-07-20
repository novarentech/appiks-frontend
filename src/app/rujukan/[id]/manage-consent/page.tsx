"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReferralById } from "@/lib/mockReferralData";
import { ReferralNotification } from "@/types/notifications";

export default function ManageConsentPage() {
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

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Kelola Persetujuan Data
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Lihat dan kelola izin akses data yang telah Anda berikan.
          </p>
        </div>

        {/* Doctor Card */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">{referral.psychologist}</h3>
                <p className="text-xs sm:text-sm text-blue-600">{referral.location}</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
              Aktif
            </div>
          </div>
          <p className="text-xs text-gray-500 ml-14">
            Izin diberikan pada: {referral.referralDate}
          </p>
        </div>

        {/* Data Sharing Info */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Data yang Dibagikan
          </h2>
        </div>

        {/* List of Data */}
        <div className="space-y-3 mb-10">
          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 bg-gray-50/50 items-start">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Riwayat mood 30 hari terakhir</h4>
              <p className="text-xs text-gray-400 mt-1">Diberikan pada: {referral.referralDate}</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 bg-gray-50/50 items-start">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Kutipan teks curhat yang memicu Red Zone</h4>
              <p className="text-xs text-gray-400 mt-1">Diberikan pada: {referral.referralDate}</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 bg-gray-50/50 items-start">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Catatan asesmen Guru BK</h4>
              <p className="text-xs text-gray-400 mt-1">Diberikan pada: {referral.referralDate}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            className="text-gray-500 hover:text-gray-900 font-medium py-6 px-8 rounded-xl"
            onClick={() => router.push("/dashboard")}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
