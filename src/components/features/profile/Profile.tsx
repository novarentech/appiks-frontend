"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Edit,
  Mail,
  Shield,
  CheckCircle,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileData {
  name: string;
  username: string;
  email: string;
  phone: string;
  nip: string;
  role: string;
}

const validateUsername = (username: string) => {
  const minLength = username.length >= 3;
  const maxLength = username.length <= 20;
  const validChars = /^[a-zA-Z0-9_]+$/.test(username);
  const notStartWithNumber = !/^\d/.test(username);

  return {
    minLength,
    maxLength,
    validChars,
    notStartWithNumber,
    isValid: minLength && maxLength && validChars && notStartWithNumber,
  };
};

const validatePhone = (phone: string) => {
  const digitsOnly = phone.replace(/\D/g, "");
  const isValidLength = digitsOnly.length >= 9 && digitsOnly.length <= 13;
  const startsWithValidDigit = /^[8-9]/.test(digitsOnly);

  return {
    isValidLength,
    startsWithValidDigit,
    isValid: isValidLength && startsWithValidDigit,
  };
};
// --- END VALIDATION FUNCTIONS ---

export default function Profile() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Username check hook
  const {
    isChecking,
    isAvailable: isUsernameAvailable,
    error: usernameError,
    checkUsername,
    clearCheck,
  } = useUsernameCheck();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Get user profile data
  const {
    isLoading: isLoadingProfile,
    error: profileError,
    profileData: apiProfileData,
  } = useUserProfile();

  // Initialize profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    username: "",
    email: "",
    phone: "",
    nip: "",
    role: "",
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Update profile data from API
  useEffect(() => {
    if (apiProfileData) {
      const updatedData: ProfileData = {
        name: apiProfileData.name || "",
        username: apiProfileData.username || "",
        email: session?.user?.email || "",
        phone: apiProfileData.phone
          ? apiProfileData.phone.replace(/^\+62/, "")
          : "",
        nip: apiProfileData.identifier || "",
        role: apiProfileData.role || "",
      };

      setProfileData(updatedData);
      setEditData(updatedData);
    }
  }, [apiProfileData, session?.user?.email]);

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      teacher: "Guru Wali",
      counselor: "Konselor",
      admin: "Admin",
      headteacher: "Kepala Sekolah",
      super: "Super Admin",
    };
    return roleMap[role] || role;
  };

  const getRoleAccessRights = (role: string) => {
    const accessMap: { [key: string]: string[] } = {
      teacher: ["Akses Data Siswa"],
      counselor: [
        "Akses Data Siswa",
        "Atur Jadwal Konseling",
        "Balas Curhat Siswa",
      ],
      admin: ["Kelola Akun", "Kelola Konten"],
      headteacher: ["Lihat Data Sekolah"],
      super: [
        "Platform Administration",
        "Multi-School Management",
        "System Configuration",
        "All Access",
      ],
    };
    return accessMap[role] || ["Basic Access"];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEditClick = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Check if only editable fields have changed
    if (
      editData.username !== profileData.username ||
      editData.phone !== profileData.phone
    ) {
      setIsConfirmDialogOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  // Handle username input with debounce and check
  const handleUsernameChange = (value: string) => {
    handleInputChange("username", value);

    if (debounceTimer) clearTimeout(debounceTimer);
    clearCheck();

    const timer = setTimeout(() => {
      if (value.trim().length >= 3 && validateUsername(value.trim()).isValid) {
        checkUsername(value.trim());
      }
    }, 500);

    setDebounceTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const handleCancelClick = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleConfirmSave = async () => {
    // Check if username is available (only if username changed and has been checked)
    if (
      profileData.username !== editData.username &&
      (isUsernameAvailable === false || usernameError)
    ) {
      // Username is not available or has error, don't proceed
      setError("Username tidak tersedia atau ada kesalahan");
      return;
    }

    if (!session?.user?.token) {
      setError("Token tidak ditemukan");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.appiks.id/api/edit-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          username: editData.username,
          phone: editData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        // Update the profile data with the response data
        const updatedData: ProfileData = {
          ...editData,
          name: data.data.name || editData.name,
          username: data.data.username || editData.username,
          phone: data.data.phone || editData.phone,
        };

        setProfileData(updatedData);
        setEditData(updatedData);
        setIsConfirmDialogOpen(false);
        setIsEditing(false);
      } else {
        throw new Error(data.message || "Profile update failed");
      }
    } catch (error) {
      let errorMessage = "Terjadi kesalahan yang tidak diketahui";
      if (error instanceof Error) {
        if (error.message.includes("422")) {
          errorMessage =
            "Data yang dikirim tidak valid. Periksa format username dan nomor telepon.";
        } else if (error.message.includes("403")) {
          errorMessage = "Akses ditolak.";
        } else if (error.message.includes("401")) {
          errorMessage = "Sesi sudah kedaluwarsa. Silakan login kembali.";
        } else if (error.message.includes("500")) {
          errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi.";
        } else {
          errorMessage = error.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Check if there are any changes in editable fields
  const hasChanges =
    editData.username !== profileData.username ||
    editData.phone !== profileData.phone;

  const usernameChanged = profileData.username !== editData.username;
  const usernameValidation = validateUsername(editData.username);
  const phoneValidation = validatePhone(editData.phone);
  const isFormValid =
    editData.username.trim() !== "" &&
    editData.phone.trim() !== "" &&
    usernameValidation.isValid &&
    phoneValidation.isValid &&
    (!usernameChanged || (isUsernameAvailable === true && !usernameError));

  // Show loading state while fetching profile data
  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Profil Anda</h1>
        </div>
        <Card className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Memuat data profil...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if profile fetch failed
  if (profileError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Profil Anda</h1>
        </div>
        <Card className="p-6">
          <div className="text-center text-red-600">
            <X className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Gagal memuat data profil</p>
            <p className="text-sm mt-1">{profileError}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profil Anda</h1>
        {!isEditing ? (
          <Button
            onClick={handleEditClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancelClick}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              onClick={handleSaveClick}
              disabled={!hasChanges || !isFormValid || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture and Basic Info */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Avatar className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                <AvatarFallback className="text-lg bg-blue-500 text-white">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {profileData.name}
            </h2>
            <p className="text-gray-600 mb-3">{profileData.username}</p>

            <div className="flex items-center justify-center mb-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                active
              </Badge>
            </div>

            <div className="flex items-center justify-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              {profileData.email}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Profile Information */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Informasi Profil
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <Input
                  value={profileData.name}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Username - Editable */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </Label>
                {isEditing ? (
                  <div className="relative">
                    <Input
                      value={editData.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="Masukkan username"
                      disabled={isChecking}
                      className={`pr-10 transition-colors ${
                        isChecking
                          ? "border-gray-300"
                          : editData.username.trim() === "" ||
                            !usernameValidation.isValid
                          ? "border-red-300 focus:border-red-500"
                          : usernameError || isUsernameAvailable === false
                          ? "border-red-300 focus:border-red-500"
                          : isUsernameAvailable === true &&
                            usernameValidation.isValid
                          ? "border-green-300 focus:border-green-500"
                          : "border-gray-300"
                      }`}
                      autoComplete="username"
                    />
                    {/* Status Icon */}
                    <div
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        isChecking
                          ? "text-gray-500"
                          : usernameError || isUsernameAvailable === false
                          ? "text-red-500"
                          : isUsernameAvailable === true
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {isChecking ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : usernameError || isUsernameAvailable === false ? (
                        <X className="w-4 h-4" />
                      ) : isUsernameAvailable === true ? (
                        <Check className="w-4 h-4" />
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <Input
                    value={profileData.username}
                    disabled
                    className="bg-gray-50"
                  />
                )}
                {isEditing && (
                  <>
                    {editData.username.trim() !== "" && (
                      <div className="mt-1">
                        {isChecking ? (
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Mengecek ketersediaan...</span>
                          </div>
                        ) : usernameError || isUsernameAvailable === false ? (
                          <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm text-red-700 flex items-center gap-2">
                            <X className="w-4 h-4 text-red-500" />
                            <span>
                              {usernameError || "Username sudah digunakan"}
                            </span>
                          </div>
                        ) : isUsernameAvailable === true &&
                          usernameValidation.isValid ? (
                          <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm text-green-700 flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Username tersedia</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                    {editData.username.trim() !== "" &&
                      !usernameValidation.isValid && (
                        <div className="text-xs mt-1">
                          <p className="text-red-500 font-medium mb-1">
                            Username harus memenuhi kriteria berikut:
                          </p>
                          <ul className="space-y-1">
                            <li
                              className={
                                usernameValidation.minLength
                                  ? "text-green-600"
                                  : "text-red-500"
                              }
                            >
                              Minimal 3 karakter{" "}
                              {usernameValidation.minLength ? "✓" : "✗"}
                            </li>
                            <li
                              className={
                                usernameValidation.maxLength
                                  ? "text-green-600"
                                  : "text-red-500"
                              }
                            >
                              Maksimal 20 karakter{" "}
                              {usernameValidation.maxLength ? "✓" : "✗"}
                            </li>
                            <li
                              className={
                                usernameValidation.validChars
                                  ? "text-green-600"
                                  : "text-red-500"
                              }
                            >
                              Hanya huruf, angka, dan underscore{" "}
                              {usernameValidation.validChars ? "✓" : "✗"}
                            </li>
                            <li
                              className={
                                usernameValidation.notStartWithNumber
                                  ? "text-green-600"
                                  : "text-red-500"
                              }
                            >
                              Tidak boleh dimulai dengan angka{" "}
                              {usernameValidation.notStartWithNumber
                                ? "✓"
                                : "✗"}
                            </li>
                          </ul>
                        </div>
                      )}
                  </>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  value={profileData.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Nomor Telepon - Editable */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                </Label>
                {isEditing ? (
                  <div className="flex">
                    <div className="flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +62
                    </div>
                    <Input
                      value={editData.phone}
                      onChange={(e) => {
                        // Remove any non-digit characters
                        let value = e.target.value.replace(/\D/g, "");
                        // Remove leading zero if present
                        if (value.startsWith("0")) {
                          value = value.substring(1);
                        }
                        handleInputChange("phone", value);
                      }}
                      placeholder="812-3456-7890"
                      type="tel"
                      className={
                        editData.phone.trim() === ""
                          ? "border-red-300 focus:border-red-500 rounded-l-none"
                          : "rounded-l-none"
                      }
                    />
                  </div>
                ) : (
                  <Input
                    value={profileData.phone}
                    disabled
                    className="bg-gray-50"
                  />
                )}
                {isEditing && (
                  <>
                    {editData.phone.trim() === "" && (
                      <p className="text-sm text-red-500 mt-1">
                        Nomor telepon wajib diisi
                      </p>
                    )}
                    {editData.phone.trim() !== "" &&
                      !phoneValidation.isValid && (
                        <div className="text-xs mt-1">
                          <p className="text-red-500 font-medium mb-1">
                            Nomor telepon harus memenuhi kriteria berikut:
                          </p>
                          <ul className="space-y-1">
                            <li
                              className={
                                phoneValidation.isValidLength
                                  ? "text-green-600"
                                  : "text-red-500"
                              }
                            >
                              9-13 digit (tanpa +62){" "}
                              {phoneValidation.isValidLength ? "✓" : "✗"}
                            </li>
                            <li
                              className={
                                phoneValidation.startsWithValidDigit
                                  ? "text-green-600"
                                  : "text-red-500"
                              }
                            >
                              Dimulai dengan 8 atau 9{" "}
                              {phoneValidation.startsWithValidDigit ? "✓" : "✗"}
                            </li>
                          </ul>
                        </div>
                      )}
                    {editData.phone.trim() !== "" &&
                      phoneValidation.isValid && (
                        <p className="text-sm text-gray-500 mt-1">
                          Format: +62{editData.phone}
                        </p>
                      )}
                  </>
                )}
              </div>

              {/* NIP/NUPTK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIP/NUPTK
                </label>
                <Input
                  value={profileData.nip}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Peran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peran
                </label>
                <Input
                  value={getRoleDisplayName(profileData.role)}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Hak Akses
            </h3>
            <div className="flex flex-wrap gap-2">
              {getRoleAccessRights(profileData.role).map((access, index) => (
                <Badge
                  key={index}
                  className="bg-teal-100 text-teal-800 border-teal-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {access}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Perubahan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyimpan perubahan profil?
            </DialogDescription>
          </DialogHeader>

          {/* Show error message if any */}
          {error && (
            <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Show what will be changed */}
          {hasChanges && (
            <div className="my-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Perubahan yang akan disimpan:
              </h4>
              <div className="space-y-1 text-sm text-blue-800">
                {profileData.username !== editData.username && (
                  <div>
                    • Username: {profileData.username} → {editData.username}
                  </div>
                )}
                {profileData.phone !== editData.phone && (
                  <div>
                    • Nomor Telepon: {profileData.phone} → +62{editData.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button onClick={handleConfirmSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Ya, Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
