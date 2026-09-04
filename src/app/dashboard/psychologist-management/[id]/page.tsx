"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Pencil } from "lucide-react";
import { specializationOptions } from "@/data/constants";
import { getPsychologists, updatePsychologist } from "@/lib/api";
import { toast } from "sonner";
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
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPsychologist = async () => {
      try {
        setLoading(true);
        const res = await getPsychologists();
        if (res.success && res.data) {
          const psychologist = res.data.find(
            (p) => p.id.toString() === psychologistId
          );
          
          if (psychologist) {
            setEmail(psychologist.username); // email using username field based on schema
            setName(psychologist.name);
            setStrNumber(psychologist.psychologist_profile?.str_number || "");
            setInstitution(psychologist.psychologist_profile?.institution_name || "");
            setPhone(psychologist.phone);
            
            const specs = psychologist.psychologist_profile?.specialization;
            // Since it is now single string, just take the first part if it's comma separated from old data
            setSelectedSpecialization(specs ? specs.split(",")[0].trim() : "");
          } else {
            toast.error("Psikolog tidak ditemukan");
            router.push("/dashboard/psychologist-management");
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data psikolog");
      } finally {
        setLoading(false);
      }
    };

    if (psychologistId) {
      fetchPsychologist();
    }
  }, [psychologistId, router]);

  const toggleSpecialization = (spec: string) => {
    if (!isEditing) return;
    setSelectedSpecialization((prev) => (prev === spec ? "" : spec));
  };

  const handleSave = async () => {
    if (!email || !name || !strNumber || !institution || !phone) {
      toast.error("Harap lengkapi semua field yang wajib");
      return;
    }

    try {
      setIsSaving(true);
      const res = await updatePsychologist(psychologistId, {
        name,
        email,
        str_number: strNumber,
        specialization: selectedSpecialization,
        institution_name: institution,
        phone_number: phone,
        is_active: true,
        ...(password ? { password } : {}),
      });

      if (res.success) {
        toast.success(res.message || "Psikolog berhasil diperbarui");
        setIsEditing(false);
        setPassword("");
      } else {
        toast.error(res.message || "Gagal memperbarui psikolog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6C63FF]" />
        <span className="ml-2 text-gray-600">Memuat data psikolog...</span>
      </div>
    );
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
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900">
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
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900">
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
                    const isSelected = selectedSpecialization === spec;
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
              <Button
                className="bg-indigo-500 hover:bg-indigo-600 text-white min-w-[150px]"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
