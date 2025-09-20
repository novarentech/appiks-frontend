"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types/auth";
import { User } from "./user-table";
import { UserPlus, UserPen, Loader2 } from "lucide-react";

interface AddEditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  role?: UserRole;
  onSave: (userData: Partial<User>) => void;
}

interface FormErrors {
  fullName?: string;
  username?: string;
  phone?: string;
  nip?: string;
  class?: string;
}

export function AddEditUserDialog({
  open,
  onOpenChange,
  user,
  role,
  onSave,
}: AddEditUserDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    nip: "",
    class: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!user;
  const userRole = user?.role || role;

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        nip: user.nip || "",
        class: user.class || "",
      });
    } else {
      setFormData({
        fullName: "",
        username: "",
        phone: "",
        nip: "",
        class: "",
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap harus diisi";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Nama lengkap minimal 2 karakter";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username hanya boleh mengandung huruf, angka, dan underscore";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else if (!/^\d{10,13}$/.test(formData.phone)) {
      newErrors.phone = "Nomor telepon harus 10-13 digit";
    }

    // NIP validation for teachers
    if (shouldShowNIP && formData.nip && !/^\d+$/.test(formData.nip)) {
      newErrors.nip = "NIP hanya boleh mengandung angka";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userData: Partial<User> = {
        ...formData,
        role: userRole,
      };

      if (user) {
        userData.id = user.id;
      }

      await onSave(userData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case "siswa":
        return "Siswa";
      case "guru_wali":
        return "Guru Wali";
      case "guru_bk":
        return "Guru BK";
      case "kepala_sekolah":
        return "Kepala Sekolah";
      default:
        return "Pengguna";
    }
  };

  const shouldShowNIP =
    userRole && ["guru_wali", "guru_bk", "kepala_sekolah"].includes(userRole);
  const shouldShowClass = userRole && ["siswa", "guru_wali"].includes(userRole);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              {isEdit ? (
                <UserPen className="w-5 h-5 text-blue-600" />
              ) : (
                <UserPlus className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <span>
              {isEdit ? "Edit" : "Tambah"} Akun {getRoleLabel(userRole)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                  className={`w-full ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="@username"
                  className={`w-full ${
                    errors.username ? "border-red-500" : ""
                  }`}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>
            </div>

            {/* Role Field - Always show as disabled */}
            <div className="space-y-2">
              <Label htmlFor="role">Peran</Label>
              <Select value={userRole || ""} disabled>
                <SelectTrigger className="w-full bg-gray-50 cursor-not-allowed">
                  <SelectValue placeholder="Peran pengguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="siswa">Siswa</SelectItem>
                  <SelectItem value="guru_wali">Guru Wali</SelectItem>
                  <SelectItem value="guru_bk">Guru BK</SelectItem>
                  <SelectItem value="kepala_sekolah">Kepala Sekolah</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Peran tidak dapat diubah setelah akun dibuat
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="081234567890"
                  className={`w-full ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {shouldShowNIP && (
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP/NUPTK</Label>
                  <Input
                    id="nip"
                    value={formData.nip}
                    onChange={(e) =>
                      setFormData({ ...formData, nip: e.target.value })
                    }
                    placeholder="Masukkan NIP/NUPTK"
                    className={`w-full ${errors.nip ? "border-red-500" : ""}`}
                  />
                  {errors.nip && (
                    <p className="text-sm text-red-500">{errors.nip}</p>
                  )}
                </div>
              )}
            </div>

            {shouldShowClass && (
              <div className="space-y-2">
                <Label htmlFor="class">
                  {userRole === "siswa" ? "Kelas" : "Wali Kelas"}
                </Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) =>
                    setFormData({ ...formData, class: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={`Pilih ${
                        userRole === "siswa" ? "kelas" : "wali kelas"
                      }`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="X IPA 1">X IPA 1</SelectItem>
                    <SelectItem value="X IPA 2">X IPA 2</SelectItem>
                    <SelectItem value="X IPA 3">X IPA 3</SelectItem>
                    <SelectItem value="XI IPA 1">XI IPA 1</SelectItem>
                    <SelectItem value="XI IPA 2">XI IPA 2</SelectItem>
                    <SelectItem value="XII IPA 1">XII IPA 1</SelectItem>
                    <SelectItem value="XII IPA 2">XII IPA 2</SelectItem>
                    <SelectItem value="X IPS 1">X IPS 1</SelectItem>
                    <SelectItem value="X IPS 2">X IPS 2</SelectItem>
                    <SelectItem value="XI IPS 1">XI IPS 1</SelectItem>
                    <SelectItem value="XI IPS 2">XI IPS 2</SelectItem>
                    <SelectItem value="XII IPS 1">XII IPS 1</SelectItem>
                    <SelectItem value="XII IPS 2">XII IPS 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>{isEdit ? "Simpan Perubahan" : "Tambah Akun"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
