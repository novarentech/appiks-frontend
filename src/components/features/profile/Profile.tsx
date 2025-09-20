"use client";

import { useState } from "react";
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
import { Edit, User, Mail, Shield, CheckCircle, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileData {
  name: string;
  username: string;
  email: string;
  phone: string;
  nip: string;
  role: string;
}

export default function Profile() {
  const { user } = useAuth();

  // Initialize profile data (in real app, this would come from the user object)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "Septi Winarti",
    username: user?.username || "septi_wali",
    email: user?.email || "septiWinarti@gmail.com",
    phone: "08123456",
    nip: "12345",
    role: user?.role || "teacher",
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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
      admin: [
        "Kelola Akun",
        "Kelola Konten"
      ],
      headteacher: [
        "Lihat Data Sekolah"
      ],
      super: [
        "Platform Administration",
        "Multi-School Management",
        "System Configuration",
        "All Access",
      ],
    };
    return accessMap[role] || ["Basic Access"];
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

  const handleCancelClick = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleConfirmSave = () => {
    // Update profile data with only the editable fields
    setProfileData({
      ...profileData,
      username: editData.username,
      phone: editData.phone,
    });
    setIsConfirmDialogOpen(false);
    setIsEditing(false);

    // Here you would typically make an API call to save the data
    console.log("Profile updated:", {
      username: editData.username,
      phone: editData.phone,
    });
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Check if there are any changes in editable fields
  const hasChanges =
    editData.username !== profileData.username ||
    editData.phone !== profileData.phone;

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
              disabled={!hasChanges}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture and Basic Info */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
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
                    className="bg-gray-50"
                  />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                {isEditing ? (
                  <Input
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    type="tel"
                  />
                ) : (
                  <Input
                    value={profileData.phone}
                    disabled
                    className="bg-gray-50"
                  />
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
                    • Nomor Telepon: {profileData.phone} → {editData.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button onClick={handleConfirmSave}>
              <Check className="w-4 h-4 mr-2" />
              Ya, Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
