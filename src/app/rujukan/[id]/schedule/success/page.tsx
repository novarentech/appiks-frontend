"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Check, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScheduleSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group mb-8"
        onClick={() => router.push("/dashboard")}
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
            Jadwal Berhasil Dibuat!
          </h1>

          <p className="text-gray-500 text-sm sm:text-base mb-8">
            Permintaan jadwal konsultasi Anda telah berhasil dikirim. Jadwal ini
            bersifat tentative dan menunggu konfirmasi dari psikolog.
          </p>

          <div className="w-full space-y-4 mb-8">
            {/* Waiting Box */}
            <div className="bg-[#FFF9E5] border border-[#FBE59E] rounded-xl p-5 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-[#B45309]" />
                <h4 className="font-semibold text-[#92400E] text-sm">
                  Menunggu Konfirmasi Psikolog
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#92400E] leading-relaxed ml-7">
                Psikolog memiliki waktu 24 jam untuk mengonfirmasi jadwal ini.
                Anda akan menerima notifikasi melalui email dan aplikasi setelah
                psikolog memberikan konfirmasi.
              </p>
            </div>

            {/* Next Steps Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900 text-sm">
                  Apa yang Terjadi Selanjutnya?
                </h4>
              </div>
              <ul className="space-y-2 ml-7">
                <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-600">
                  <span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  Psikolog akan meninjau permintaan Anda
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-600">
                  <span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  Sistem AI sedang menyiapkan ringkasan data Anda
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-600">
                  <span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  Anda akan menerima notifikasi setelah dikonfirmasi
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-600">
                  <span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  Jika tidak dikonfirmasi dalam 24 jam, slot akan tersedia
                  kembali
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <Button
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-6 rounded-xl"
              onClick={() => router.push("/dashboard")}
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
