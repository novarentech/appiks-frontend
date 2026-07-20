"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConsentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      router.push(`/rujukan/${id}/schedule`);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, id, router]);

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

        <div className="flex flex-col items-center text-center mx-auto">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-500" strokeWidth={3} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Persetujuan Berhasil!
          </h1>
          
          <p className="text-gray-500 text-sm sm:text-base mb-8">
            Data Anda telah berhasil dibagikan kepada psikolog mitra. Sistem sedang memproses informasi Anda untuk menyiapkan laporan AI.
          </p>

          {/* Info Box */}
          <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-left mb-8">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm mb-1">Langkah Selanjutnya</h4>
              <p className="text-xs text-blue-600 leading-relaxed">
                Anda akan diarahkan ke halaman pemilihan jadwal konsultasi dalam beberapa detik. Silakan pilih waktu yang sesuai dengan jadwal Anda.
              </p>
            </div>
          </div>

          <Button 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-6 rounded-xl mb-4"
            onClick={() => router.push(`/rujukan/${id}/schedule`)}
          >
            Lanjut ke Pemilihan Jadwal
          </Button>

          <p className="text-sm text-gray-400">
            Otomatis dialihkan dalam {countdown} detik...
          </p>
        </div>
      </div>
    </div>
  );
}
