"use client";

import { useState } from "react";
import { Edit2, GraduationCap, Building, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

const ProfileStudent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "Marsha Bilqis Nasywaa",
    username: "marsha.bilqis",
    nisn: "123456",
    mentor: "Budi Santoso",
    kelas: "Kelas XI IPA 6",
    namaSekolah: "SMA Negeri 01 Yogyakarta",
    noTelp: "088123456",
    avatar: "/avatar-placeholder.jpg",
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    setShowSaveModal(false);
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
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

  // Check if there are any changes
  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(editData);

  return (
    <>
      <div className="text-center mb-18">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
          Profil Saya
        </h1>
        <p className="text-muted-foreground">Kelola informasi pribadi mu</p>
      </div>
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
                Username
              </Label>
              {isEditing ? (
                <Input
                  value={editData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Masukkan username"
                />
              ) : (
                <Input
                  value={profileData.username}
                  disabled
                  className="bg-gray-50 text-gray-600"
                />
              )}
            </div>

            {/* No Telp - Editable */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                No Telp
              </Label>
              {isEditing ? (
                <Input
                  value={editData.noTelp}
                  onChange={(e) => handleInputChange("noTelp", e.target.value)}
                  placeholder="Masukkan nomor telepon"
                  type="tel"
                />
              ) : (
                <Input
                  value={profileData.noTelp}
                  disabled
                  className="bg-gray-50 text-gray-600"
                />
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end mt-8">
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profil
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
                <Button
                  onClick={handleSaveClick}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={!hasChanges}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Simpan
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
            >
              <X className="w-4 h-4 mr-2" />
              Tidak
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Ya, Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ProfileStudent };
