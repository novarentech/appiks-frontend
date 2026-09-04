"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff, Building2, Pencil } from "lucide-react";
import { mockPsychologists, specializationOptions } from "@/data/mockPsychologists";
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

export default function EditPsychologistPage() {
  return (
    <RoleGuard permissionType="dashboard">
      <EditPsychologistContent />
    </RoleGuard>
  );
}

function EditPsychologistContent() {
  const router = useRouter();
  const params = useParams();
  const psychologistId = params.id as string;

  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [strNumber, setStrNumber] = useState("");
  const [institution, setInstitution] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    if (psychologistId) {
      const psychologist = mockPsychologists.find((p) => p.id === psychologistId);
      if (psychologist) {
        setEmail(psychologist.email);
        setName(psychologist.name);
        setStrNumber(psychologist.strNumber);
        setInstitution(psychologist.institution);
        setPhone(psychologist.phoneNumber);
        setSelectedSpecializations(psychologist.specializations || []);
        // Password usually isn't fetched, keeping it blank for edit
      }
      setLoading(false);
    }
  }, [psychologistId]);

  const toggleSpecialization = (spec: string) => {
    if (!isEditing) return;
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  if (loading) {
    return <div className="p-6">Memuat data...</div>;
  }

  return (
    <div className="space-y-6 p-6">
    
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Psikolog Mitra
        </h1>
        <p className="text-gray-500 mt-1">
          Perbarui informasi akun psikolog mitra penerima rujukan siswa
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: budi.santoso@klinik.id"
                  disabled={!isEditing}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi baru"
                    disabled={!isEditing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    disabled={!isEditing}
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
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 disabled:opacity-50"
                  disabled={!isEditing}
                />
                <label
                  htmlFor="sendEmail"
                  className={`text-sm font-medium leading-none text-gray-600 ${
                    !isEditing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Dr. Budi Santoso, M.Psi., Psikolog"
                  disabled={!isEditing}
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
                  value={strNumber}
                  onChange={(e) => setStrNumber(e.target.value)}
                  placeholder="Contoh: STR-PSI-00201"
                  disabled={!isEditing}
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
                        disabled={!isEditing}
                        className={`px-3 py-1 text-sm rounded-full transition-colors border ${
                          !isEditing && isSelected
                            ? "bg-white border-gray-300 text-gray-600 opacity-80"
                            : !isEditing && !isSelected
                            ? "bg-gray-50 border-gray-200 text-gray-400 opacity-60"
                            : isSelected
                            ? "bg-white border-indigo-500 text-indigo-600"
                            : "bg-indigo-50 border-indigo-50 text-indigo-400 hover:bg-indigo-100"
                        } ${!isEditing ? "cursor-not-allowed" : ""}`}
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
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Contoh: Puskesmas Gejayan"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium text-gray-700">
                  No Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 0812345678910"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
          {!isEditing ? (
            <Button
              className="bg-indigo-500 hover:bg-indigo-600 text-white min-w-[150px]"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Data
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-gray-700"
                onClick={() => {
                  setIsEditing(false);
                  // Optional: Fetch data again to reset, or just keep it simple
                }}
              >
                Batal
              </Button>
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white min-w-[150px]">
                <Pencil className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
