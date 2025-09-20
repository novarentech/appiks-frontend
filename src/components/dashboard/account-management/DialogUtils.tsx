/**
 * Shared utilities and constants for account management dialogs
 */

import { UserRole } from "@/types/auth";

// Role display utilities
export const getRoleLabel = (role: UserRole): string => {
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

export const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case "siswa":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "guru_wali":
      return "bg-green-100 text-green-700 border-green-200";
    case "guru_bk":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "kepala_sekolah":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Form validation utilities
export const validateFullName = (name: string): string | null => {
  if (!name.trim()) return "Nama lengkap harus diisi";
  if (name.length < 2) return "Nama lengkap minimal 2 karakter";
  if (name.length > 100) return "Nama lengkap maksimal 100 karakter";
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username.trim()) return "Username harus diisi";
  if (username.length < 3) return "Username minimal 3 karakter";
  if (username.length > 50) return "Username maksimal 50 karakter";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username hanya boleh mengandung huruf, angka, dan underscore";
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return "Nomor telepon harus diisi";
  if (!/^\d{10,13}$/.test(phone)) {
    return "Nomor telepon harus 10-13 digit";
  }
  return null;
};

export const validateNIP = (nip: string): string | null => {
  if (nip && !/^\d+$/.test(nip)) {
    return "NIP hanya boleh mengandung angka";
  }
  if (nip && (nip.length < 8 || nip.length > 18)) {
    return "NIP harus 8-18 digit";
  }
  return null;
};

// Class options
export const getClassOptions = () => [
  // Kelas X
  "X IPA 1",
  "X IPA 2",
  "X IPA 3",
  "X IPS 1",
  "X IPS 2",
  "X IPS 3",
  "X BAHASA",
  "X AGAMA",

  // Kelas XI
  "XI IPA 1",
  "XI IPA 2",
  "XI IPA 3",
  "XI IPS 1",
  "XI IPS 2",
  "XI IPS 3",
  "XI BAHASA",
  "XI AGAMA",

  // Kelas XII
  "XII IPA 1",
  "XII IPA 2",
  "XII IPA 3",
  "XII IPS 1",
  "XII IPS 2",
  "XII IPS 3",
  "XII BAHASA",
  "XII AGAMA",
];

// File validation for bulk import
export const validateUploadFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!allowedTypes.includes(file.type)) {
    return "File harus berformat .xlsx atau .xls";
  }

  if (file.size > maxSize) {
    return "Ukuran file tidak boleh lebih dari 5MB";
  }

  if (file.size === 0) {
    return "File tidak boleh kosong";
  }

  return null;
};

// User initials generator
export const getUserInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};
