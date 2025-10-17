"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GraduationCap, Building, Check, X, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaChalkboardTeacher } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";

// --- VALIDATION FUNCTIONS (SAMA DENGAN FillData) ---
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

interface ProfileData {
  fullName: string;
  username: string;
  nisn: string;
  mentor: string;
  kelas: string;
  namaSekolah: string;
  noTelp: string;
  avatar?: string;
}

const StudentProfile = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    isLoading: isLoadingProfile,
    error: profileError,
    profileData: apiProfileData,
  } = useUserProfile();
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Username check hook
  const {
    isChecking,
    isAvailable: isUsernameAvailable,
    error: usernameError,
    checkUsername,
    clearCheck,
  } = useUsernameCheck();
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    username: "",
    nisn: "",
    mentor: "",
    kelas: "",
    namaSekolah: "",
    noTelp: "",
    avatar: "/avatar-placeholder.jpg",
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);

  // Update profile data from API
  useEffect(() => {
    if (apiProfileData) {
      const updatedData: ProfileData = {
        fullName: apiProfileData.name || "",
        username: apiProfileData.username || "",
        nisn: apiProfileData.identifier || "",
        mentor: apiProfileData.mentor?.name || "",
        kelas: apiProfileData.room?.name || "",
        namaSekolah: apiProfileData.school?.name || "",
        noTelp: apiProfileData.phone
          ? apiProfileData.phone.replace(/^62/, "")
          : "",
        avatar: "/avatar-placeholder.jpg",
      };

      setProfileData(updatedData);
      setEditData(updatedData);
      setIsEditMode(false); // Reset edit mode on data load
    }
  }, [apiProfileData]);

  // Handle input change
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    }, 5000);

    setDebounceTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Check if there are any changes and if form is valid
  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(editData);
  const usernameChanged = profileData.username !== editData.username;
  const usernameValidation = validateUsername(editData.username);
  const phoneValidation = validatePhone(editData.noTelp);
  const isFormValid =
    editData.username.trim() !== "" &&
    editData.noTelp.trim() !== "" &&
    usernameValidation.isValid &&
    phoneValidation.isValid &&
    (!usernameChanged || (isUsernameAvailable === true && !usernameError));

  // Save logic
  const handleSaveClick = () => setShowSaveModal(true);

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
          "Authorization": `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          username: editData.username,
          phone: editData.noTelp,
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
          fullName: data.data.name || editData.fullName,
          username: data.data.username || editData.username,
          nisn: data.data.identifier || editData.nisn,
          noTelp: data.data.phone
            ? data.data.phone.replace(/^62/, "")
            : editData.noTelp,
        };
        
        setProfileData(updatedData);
        setEditData(updatedData);
        setShowSaveModal(false);
        setIsEditMode(false);
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

  const handleCancelSave = () => setShowSaveModal(false);

  // Show loading state while fetching profile data
  if (isLoadingProfile) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Memuat data profil...</span>
        </div>
      </Card>
    );
  }

  // Show error state if profile fetch failed
  if (profileError) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <X className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Gagal memuat data profil</p>
          <p className="text-sm mt-1">{profileError}</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Profile Card */}
      <Card className="relative p-0">
        <CardHeader className="pb-4 p-0">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={profileData.avatar}
                alt={profileData.fullName}
              />
              <AvatarFallback className="text-lg bg-blue-500 text-white">
                {getInitials(profileData.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 justify-center sm:justify-start text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profileData.fullName}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>{profileData.kelas}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>{profileData.namaSekolah}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaChalkboardTeacher className="w-4 h-4" />
                  <span>{profileData.mentor}</span>
                </div>
              </div>
            </div>
            {/* Edit Profile Button */}
            {!isEditMode && (
              <Button
                variant="outline"
                className="mt-4 sm:mt-0"
                onClick={() => setIsEditMode(true)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profil
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap - Non-editable */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Nama Lengkap
              </Label>
              <Input
                value={profileData.fullName}
                disabled
                className="bg-gray-50 text-gray-600"
              />
            </div>

            {/* NISN - Non-editable */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">NISN</Label>
              <Input
                value={profileData.nisn}
                disabled
                className="bg-gray-50 text-gray-600"
              />
            </div>

            {/* Username - Editable with live checking */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Username *
              </Label>
              <div className="relative">
                <Input
                  value={editData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="Masukkan username"
                  disabled={!isEditMode || isChecking}
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
                  ) : isUsernameAvailable === true && usernameValidation.isValid ? (
                    <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm text-green-700 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Username tersedia</span>
                    </div>
                  ) : null}
                </div>
              )}
              {editData.username.trim() !== "" &&
                !usernameValidation.isValid && (
                  <div className="text-xs">
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
                        {usernameValidation.notStartWithNumber ? "✓" : "✗"}
                      </li>
                    </ul>
                  </div>
                )}
            </div>

            {/* No Telp - Editable */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                No Telp *
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +62
                </div>
                <Input
                  value={editData.noTelp}
                  onChange={(e) => {
                    // Remove any non-digit characters
                    let value = e.target.value.replace(/\D/g, "");
                    // Remove leading zero if present
                    if (value.startsWith("0")) {
                      value = value.substring(1);
                    }
                    handleInputChange("noTelp", value);
                  }}
                  placeholder="812-3456-7890"
                  type="tel"
                  disabled={!isEditMode}
                  className={
                    editData.noTelp.trim() === ""
                      ? "border-red-300 focus:border-red-500 rounded-l-none"
                      : "rounded-l-none"
                  }
                />
              </div>
              {editData.noTelp.trim() === "" && (
                <p className="text-sm text-red-500">
                  Nomor telepon wajib diisi
                </p>
              )}
              {editData.noTelp.trim() !== "" && !phoneValidation.isValid && (
                <div className="text-xs">
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
              {editData.noTelp.trim() !== "" && phoneValidation.isValid && (
                <p className="text-sm text-gray-500">
                  Format: 62{editData.noTelp}
                </p>
              )}
            </div>
          </div>

          {/* Save & Cancel Buttons */}
          <div className="flex flex-col items-end mt-8">
            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {isEditMode && (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveClick}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={!hasChanges || !isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Simpan Profil
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditData(profileData);
                    setIsEditMode(false);
                    setError(null);
                  }}
                  disabled={isLoading}
                >
                  Batal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Confirmation Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Konfirmasi Simpan Perubahan
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Apakah Anda yakin ingin menyimpan perubahan pada profil Anda?
            </DialogDescription>
          </DialogHeader>

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
                {profileData.noTelp !== editData.noTelp && (
                  <div>
                    • No Telp: {profileData.noTelp} → +62{editData.noTelp}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelSave}
              className="flex-1"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Tidak
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
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
    </>
  );
};

export { StudentProfile };