"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GraduationCap, Building, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import { useUserProfile } from "@/hooks/useUserProfile";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaChalkboardTeacher } from "react-icons/fa";

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

const FillData = () => {
  const { data: session } = useSession();
  const { isLoading, error, updateProfile } = useProfileUpdate();
  const {
    isLoading: isLoadingProfile,
    error: profileError,
    profileData: apiProfileData,
  } = useUserProfile();
  const [showSaveModal, setShowSaveModal] = useState(false);

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

  // Update profile data when API data is loaded
  useEffect(() => {
    if (apiProfileData) {
      const updatedData: ProfileData = {
        fullName: apiProfileData.name || "",
        username: apiProfileData.username || "",
        nisn: apiProfileData.identifier || "",
        mentor: apiProfileData.mentor.name || "", 
        kelas: apiProfileData.room.name || "", 
        namaSekolah: apiProfileData.school.name || "",
        noTelp: apiProfileData.phone || "",
        avatar: "/avatar-placeholder.jpg",
      };

      setProfileData(updatedData);
      setEditData(updatedData);
      console.log("✅ Profile data updated from API:", updatedData);
    }
  }, [apiProfileData]);

  // Update initial data when session is available
  useEffect(() => {
    if (session?.user) {
      const initialData = {
        fullName: "Marsha Bilqis Nasywaa",
        username: session.user.username || "",
        nisn: "123456",
        mentor: "Budi Santoso",
        kelas: "Kelas XI IPA 6",
        namaSekolah: "SMA Negeri 01 Yogyakarta",
        noTelp: "",
        avatar: "/avatar-placeholder.jpg",
      };
      setProfileData(initialData);
      setEditData(initialData);
    }
  }, [session]);

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    const success = await updateProfile({
      username: editData.username,
      phone: editData.noTelp,
    });

    if (success) {
      setProfileData(editData);
      setShowSaveModal(false);
    }
    // Error handling is done in the hook
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Check if there are any changes and if form is valid
  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(editData);
  const isFormValid =
    editData.username.trim() !== "" && editData.noTelp.trim() !== "";

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

            {/* Username - Editable */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Username *
              </Label>
              <Input
                value={editData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Masukkan username"
                className={
                  editData.username.trim() === ""
                    ? "border-red-300 focus:border-red-500"
                    : ""
                }
              />
              {editData.username.trim() === "" && (
                <p className="text-sm text-red-500">Username wajib diisi</p>
              )}
            </div>

            {/* No Telp - Editable */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                No Telp *
              </Label>
              <Input
                value={editData.noTelp}
                onChange={(e) => handleInputChange("noTelp", e.target.value)}
                placeholder="Masukkan nomor telepon"
                type="tel"
                className={
                  editData.noTelp.trim() === ""
                    ? "border-red-300 focus:border-red-500"
                    : ""
                }
              />
              {editData.noTelp.trim() === "" && (
                <p className="text-sm text-red-500">
                  Nomor telepon wajib diisi
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex flex-col items-end mt-8">
            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
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
              Perubahan yang telah disimpan tidak dapat dibatalkan.
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
                    • No Telp: {profileData.noTelp} → {editData.noTelp}
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

export { FillData };
