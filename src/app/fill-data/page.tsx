"use client";

import { FillData } from "@/components/auth/FillData";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function FillDataPage() {
  return <FillDataContent />;
}

function FillDataContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Yuk Lengkapi Dulu Profilmu Sebelum Memulai !
          </h1>
          <p className="text-gray-600">
            Profil hanya bisa diisi sekali. Pastikan data yang Anda masukkan
            sudah benar.
          </p>
        </div>
        <FillData />
      </div>
    </div>
  );
}
