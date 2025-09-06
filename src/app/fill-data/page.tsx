"use client";

import { FillData } from "@/components/auth/FillData";
import { SessionDebug } from "@/components/debug/SessionDebug";
import { useVerificationRedirect } from "@/hooks/useVerificationRedirect";
import { Loader2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FillDataPage() {
  const { isLoading, isVerified, canAccessFillData } =
    useVerificationRedirect();

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-600">Memuat data session...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show message if user is already verified (shouldn't happen due to redirect)
  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <ShieldCheck className="w-12 h-12 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Profil Sudah Terverifikasi
            </h2>
            <p className="text-gray-600">
              Anda sudah menyelesaikan pengisian profil dan tidak dapat
              mengubahnya lagi.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Show fill data form if user can access it
  if (canAccessFillData) {
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

  // Fallback (shouldn't reach here)
  return null;
}
