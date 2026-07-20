"use client";

import { useRouter } from "next/navigation";
import { XCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConsentFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group mb-8"
        onClick={() => router.push("/dashboard")}
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Beranda
      </Button>

      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 relative">

        <div className="flex flex-col items-center text-center mx-auto">
          {/* Failed Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8 text-red-500" strokeWidth={2.5} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Persetujuan Dibatalkan
          </h1>
          
          <p className="text-gray-500 text-sm sm:text-base mb-8">
            Anda telah memilih untuk tidak menyetujui pembagian data. Proses rujukan ke psikolog tidak dapat dilanjutkan saat ini.
          </p>

          <Button 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-6 rounded-xl"
            onClick={() => router.push("/dashboard")}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
