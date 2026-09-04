"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { specializationOptions } from "@/data/mockPsychologists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function AddPsychologistPage() {
  return (
    <RoleGuard permissionType="dashboard">
      <AddPsychologistContent />
    </RoleGuard>
  );
}

function AddPsychologistContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tambah Psikolog Mitra
        </h1>
        <p className="text-gray-500 mt-1">
          Tambahkan akun psikolog mitra untuk menerima rujukan siswa
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Kiri: Akun Kredensial */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Akun Kredensial
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Informasi akun login psikolog
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Contoh: budi.santoso@klinik.id"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label
                  htmlFor="sendEmail"
                  className="text-sm font-medium leading-none text-gray-600 cursor-pointer"
                >
                  Kirim kredensial login ke email psikolog
                </label>
              </div>
            </div>
          </div>

          {/* Kanan: Informasi Profesional */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Informasi Profesional
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Informasi akun login psikolog
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium text-gray-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Contoh: Dr. Budi Santoso, M.Psi., Psikolog"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="strNumber"
                  className="font-medium text-gray-700"
                >
                  Nomor STR <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="strNumber"
                  type="text"
                  placeholder="Contoh: STR-PSI-00201"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-gray-700">
                  Spesialisasi <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {specializationOptions.map((spec) => {
                    const isSelected = selectedSpecializations.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors border ${
                          isSelected
                            ? "bg-white border-indigo-500 text-indigo-600"
                            : "bg-indigo-50 border-indigo-50 text-indigo-400 hover:bg-indigo-100"
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="institution"
                  className="font-medium text-gray-700"
                >
                  Institusi/puskesmas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="institution"
                  type="text"
                  placeholder="Contoh: Puskesmas Gejayan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium text-gray-700">
                  No Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Contoh: 0812345678910"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            className="text-gray-700"
            onClick={() => router.push("/dashboard/psychologist-management")}
          >
            Batal
          </Button>
          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white min-w-[100px]">
            + Tambah
          </Button>
        </div>
      </div>
    </div>
  );
}
