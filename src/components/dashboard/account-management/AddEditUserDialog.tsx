
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { getRooms, getUsersByType } from "@/lib/api";
import { RoomData, User as ApiUser } from "@/types/api";
import { UserPlus, UserPen, Loader2, Check, X } from "lucide-react";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";

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
  password?: string;
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
    password: "",
    mentor: "",
  });

  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomsLoaded, setRoomsLoaded] = useState(false);

  const [mentors, setMentors] = useState<ApiUser[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [mentorsLoaded, setMentorsLoaded] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const {
    isChecking,
    isAvailable: isUsernameAvailable,
    error: usernameError,
    checkUsername,
    clearCheck,
  } = useUsernameCheck();

  const isEdit = !!user;
  const userRole = user?.role || role;

  // Helper function to get class name by ID
  const getSelectedClassName = useCallback((classId: string) => {
    const room = rooms.find((r: RoomData) => r.id.toString() === classId);
    return room ? room.mention : classId;
  }, [rooms]);

  // Helper function to get mentor name by ID
  const getMentorName = useCallback((mentorId: string) => {
    const mentor = mentors.find((c: ApiUser) => c.id && c.id.toString() === mentorId);
    return mentor ? mentor.name : mentorId;
  }, [mentors]);

  // Password validation function
  const validatePassword = useCallback((password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
    };
  }, []);

  // Username validation function
  const validateUsername = useCallback((username: string) => {
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
  }, []);

  // Phone validation function
  const validatePhone = useCallback((phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");
    const isValidLength = digitsOnly.length >= 9 && digitsOnly.length <= 13;
    const startsWithValidDigit = /^[8-9]/.test(digitsOnly);

    return {
      isValidLength,
      startsWithValidDigit,
      isValid: isValidLength && startsWithValidDigit,
    };
  }, []);

  // Reset form data when user prop changes or when dialog opens/closes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        username: user.username,
        phone: user.phone ? user.phone.replace(/62/, "") : "",
        nip: user.nip || "",
        class: user.room ? user.room.id.toString() : "",
        password: user.password || "",
        mentor: user.mentor || "",
      });
    } else {
      setFormData({
        fullName: "",
        username: "",
        phone: "",
        nip: "",
        class: "",
        password: "",
        mentor: "",
      });
    }
    setErrors({});
  }, [user, open]);

  const validateForm = useCallback((): boolean => {
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
    } else {
      const usernameValidation = validateUsername(formData.username);
      if (!usernameValidation.isValid) {
        newErrors.username = "Username tidak valid";
      }

      // Check if username is available (only if username changed)
      const usernameChanged = user?.username !== formData.username;
      if (usernameChanged && (isUsernameAvailable === false || usernameError)) {
        newErrors.username = usernameError || "Username sudah digunakan";
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = "Nomor telepon tidak valid";
      }
    }

    // NIP/NISN validation
    const shouldShowNIP = userRole && ["guru_wali", "guru_bk", "kepala_sekolah", "siswa"].includes(userRole);
    if (shouldShowNIP && formData.nip) {
      if (!/^\d+$/.test(formData.nip)) {
        newErrors.nip =
          userRole === "siswa"
            ? "NISN hanya boleh mengandung angka"
            : "NIP hanya boleh mengandung angka";
      } else {
        // Length validation
        if (userRole === "siswa") {
          // NISN should be minimal 10 characters
          if (formData.nip.length < 10) {
            newErrors.nip = "NISN minimal 10 karakter";
          }
        } else {
          // NIP should be minimal 16 characters for teachers/staff
          if (formData.nip.length < 16) {
            newErrors.nip = "NIP/NUPTK minimal 16 karakter";
          }
        }
      }
    }

    // Password validation (required for add, optional for edit)
    if (!isEdit && !formData.password.trim()) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password && !validatePassword(formData.password).isValid) {
      newErrors.password = "Password tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, userRole, user, isUsernameAvailable, usernameError, validateUsername, validatePhone, validatePassword]);

  // Handle username input with debounce
  const handleUsernameChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, username: value }));

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Clear previous check results
    clearCheck();

    // Set new timer for debounced checking
    const timer = setTimeout(() => {
      if (value.trim().length >= 3 && validateUsername(value.trim()).isValid) {
        checkUsername(value.trim());
      }
    }, 500); // 500ms delay

    setDebounceTimer(timer);
  }, [debounceTimer, clearCheck, checkUsername, validateUsername]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username is available (only if username changed and has been checked)
    if (
      user?.username !== formData.username &&
      (isUsernameAvailable === false || usernameError)
    ) {
      // Username is not available or has error, don't proceed
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format phone number with country code
      const formattedPhone = formData.phone ? `62${formData.phone}` : "";

      const userData: Partial<User> = {
        ...formData,
        phone: formattedPhone,
        role: userRole,
        mentor: formData.mentor,
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

  const shouldShowNIP = userRole && ["guru_wali", "guru_bk", "kepala_sekolah", "siswa"].includes(userRole);
  const shouldShowClass = userRole && ["siswa"].includes(userRole);

  // Fetch rooms data - only when needed and not already loaded
  useEffect(() => {
    const fetchRooms = async () => {
      if (!shouldShowClass || loadingRooms || roomsLoaded) return;

      setLoadingRooms(true);
      try {
        const response = await getRooms();
        if (response.success) {
          setRooms(response.data);
          setRoomsLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [shouldShowClass, loadingRooms, roomsLoaded]);

  // Fetch mentors data - only when needed and not already loaded
  useEffect(() => {
    const fetchMentors = async () => {
      if (userRole !== "siswa" || loadingMentors || mentorsLoaded) return;

      setLoadingMentors(true);
      try {
        const response = await getUsersByType("teacher");
        if (response.success) {
          setMentors(response.data);
          setMentorsLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoadingMentors(false);
      }
    };

    fetchMentors();
  }, [userRole, loadingMentors, mentorsLoaded]);

  // Update form data for class when rooms are loaded and we're editing
  useEffect(() => {
    if (isEdit && shouldShowClass && user?.room && rooms.length > 0 && !loadingRooms) {
      const classId = user.room.id.toString();
      const roomExists = rooms.some(room => room.id.toString() === classId);
      
      if (roomExists && formData.class !== classId) {
        setFormData(prev => ({
          ...prev,
          class: classId
        }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms.length, loadingRooms, isEdit, shouldShowClass, user?.room?.id, formData.class]);

  // Update form data for mentor when mentors are loaded and we're editing
  useEffect(() => {
    if (isEdit && userRole === "siswa" && user?.mentor && mentors.length > 0 && !loadingMentors) {
      // Find mentor by name in the mentors list
      const mentor = mentors.find(m => m.name === user.mentor);
      
      if (mentor && mentor.id) {
        const mentorId = mentor.id.toString();
        if (formData.mentor !== mentorId) {
          setFormData(prev => ({
            ...prev,
            mentor: mentorId
          }));
        }
      } else if (mentor && mentor.identifier && formData.mentor !== mentor.identifier) {
        setFormData(prev => ({
          ...prev,
          mentor: mentor.identifier
        }));
      }
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentors.length, loadingMentors, isEdit, userRole, user?.mentor, formData.mentor]);

  // Check if form is valid
  const usernameValidation = validateUsername(formData.username);
  const phoneValidation = validatePhone(formData.phone);
  const passwordValidation = validatePassword(formData.password);
  const usernameChanged = user?.username !== formData.username;

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.username.trim() !== "" &&
    formData.phone.trim() !== "" &&
    usernameValidation.isValid &&
    phoneValidation.isValid &&
    (isEdit ? (!formData.password || passwordValidation.isValid) : passwordValidation.isValid) &&
    (!usernameChanged || (isUsernameAvailable === true && !usernameError));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
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

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
                    setFormData(prev => ({ ...prev, fullName: e.target.value }))
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

                <div className="relative">
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="username"
                    disabled={isChecking}
                    className={`pr-10 transition-colors ${
                      isChecking
                        ? "border-gray-300"
                        : formData.username.trim() === "" ||
                          !validateUsername(formData.username).isValid
                        ? "border-red-300 focus:border-red-500"
                        : usernameError || isUsernameAvailable === false
                        ? "border-red-300 focus:border-red-500"
                        : isUsernameAvailable === true &&
                          validateUsername(formData.username).isValid
                        ? "border-green-300 focus:border-green-500"
                        : "border-gray-300"
                    }`}
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

                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}

                {/* Status Message - Only for availability check */}
                {formData.username.trim() !== "" && (
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
                      validateUsername(formData.username).isValid ? (
                      <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm text-green-700 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Username tersedia</span>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Username Validation Rules */}
                {formData.username.trim() !== "" &&
                  !validateUsername(formData.username).isValid && (
                    <div className="text-xs">
                      <p className="text-red-500 font-medium mb-1">
                        Username harus memenuhi kriteria berikut:
                      </p>
                      <ul className="space-y-1">
                        <li
                          className={
                            validateUsername(formData.username).minLength
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        >
                          Minimal 3 karakter{" "}
                          {validateUsername(formData.username).minLength
                            ? "✓"
                            : "✗"}
                        </li>
                        <li
                          className={
                            validateUsername(formData.username).maxLength
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        >
                          Maksimal 20 karakter{" "}
                          {validateUsername(formData.username).maxLength
                            ? "✓"
                            : "✗"}
                        </li>
                        <li
                          className={
                            validateUsername(formData.username).validChars
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        >
                          Hanya huruf, angka, dan underscore{" "}
                          {validateUsername(formData.username).validChars
                            ? "✓"
                            : "✗"}
                        </li>
                        <li
                          className={
                            validateUsername(formData.username)
                              .notStartWithNumber
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        >
                          Tidak boleh dimulai dengan angka{" "}
                          {validateUsername(formData.username)
                            .notStartWithNumber
                            ? "✓"
                            : "✗"}
                        </li>
                      </ul>
                    </div>
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

            <div className="space-y-2">
              <Label htmlFor="phone">
                Nomor Telepon <span className="text-red-500">*</span>
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +62
                </div>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    // Remove any non-digit characters
                    const value = e.target.value.replace(/\D/g, "");
                    // Remove leading zero if present
                    if (value.startsWith("0")) {
                      setFormData(prev => ({ ...prev, phone: value.substring(1) }));
                    } else {
                      setFormData(prev => ({ ...prev, phone: value }));
                    }
                  }}
                  placeholder="812-3456-7890"
                  type="tel"
                  className={`w-full ${
                    errors.phone
                      ? "border-red-500 rounded-l-none"
                      : "rounded-l-none"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}

              {/* Phone Validation Rules */}
              {formData.phone.trim() !== "" &&
                !validatePhone(formData.phone).isValid && (
                  <div className="text-xs">
                    <p className="text-red-500 font-medium mb-1">
                      Nomor telepon harus memenuhi kriteria berikut:
                    </p>
                    <ul className="space-y-1">
                      <li
                        className={
                          validatePhone(formData.phone).isValidLength
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        9-13 digit (tanpa +62){" "}
                        {validatePhone(formData.phone).isValidLength
                          ? "✓"
                          : "✗"}
                      </li>
                      <li
                        className={
                          validatePhone(formData.phone).startsWithValidDigit
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        Dimulai dengan 8 atau 9{" "}
                        {validatePhone(formData.phone).startsWithValidDigit
                          ? "✓"
                          : "✗"}
                      </li>
                    </ul>
                  </div>
                )}
              {formData.phone.trim() !== "" &&
                validatePhone(formData.phone).isValid && (
                  <p className="text-sm text-gray-500">
                    Format: 62{formData.phone}
                  </p>
                )}
            </div>

            {shouldShowNIP && (
              <div className="space-y-2">
                <Label htmlFor="nip">
                  {userRole === "siswa" ? "NISN" : "NIP/NUPTK"}
                </Label>
                <Input
                  id="nip"
                  value={formData.nip}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, nip: e.target.value }))
                  }
                  placeholder={
                    userRole === "siswa"
                      ? "Masukkan NISN"
                      : "Masukkan NIP/NUPTK"
                  }
                  className={`w-full ${errors.nip ? "border-red-500" : ""}`}
                />
                {errors.nip && (
                  <p className="text-sm text-red-500">{errors.nip}</p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password{" "}
                {!isEdit ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-gray-500 text-xs">(Opsional)</span>
                )}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                }
                placeholder={!isEdit ? "Masukkan password" : "Masukkan password (kosongkan jika tidak ingin mengubah)"}
                className={`w-full ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}

              {/* Password Validation Rules */}
              {formData.password.trim() !== "" &&
                !validatePassword(formData.password).isValid && (
                  <div className="text-xs text-red-500 space-y-1">
                    <p className="font-medium">
                      Password harus memenuhi kriteria:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li
                        className={
                          validatePassword(formData.password).minLength
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        Minimal 8 karakter{" "}
                        {validatePassword(formData.password).minLength
                          ? "✓"
                          : "✗"}
                      </li>
                      <li
                        className={
                          validatePassword(formData.password).hasUpperCase
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        Mengandung huruf besar (A-Z){" "}
                        {validatePassword(formData.password).hasUpperCase
                          ? "✓"
                          : "✗"}
                      </li>
                      <li
                        className={
                          validatePassword(formData.password).hasLowerCase
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        Mengandung huruf kecil (a-z){" "}
                        {validatePassword(formData.password).hasLowerCase
                          ? "✓"
                          : "✗"}
                      </li>
                      <li
                        className={
                          validatePassword(formData.password).hasNumber
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        Mengandung angka (0-9){" "}
                        {validatePassword(formData.password).hasNumber
                          ? "✓"
                          : "✗"}
                      </li>
                    </ul>
                  </div>
                )}
              <p className="text-xs text-gray-500">
                {isEdit
                  ? "Kosongkan jika tidak ingin mengubah password"
                  : "Password wajib diisi"}
              </p>
            </div>

            {shouldShowClass && (
              <div className="space-y-2">
                <Label htmlFor="class">Kelas</Label>
                <Select
                  value={loadingRooms ? "" : formData.class}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, class: value }))
                  }
                  disabled={loadingRooms}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingRooms ? "Memuat data kelas..." :
                        formData.class ? getSelectedClassName(formData.class) : "Pilih kelas"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingRooms ? (
                      <SelectItem value="loading" disabled>
                        Memuat data kelas...
                      </SelectItem>
                    ) : rooms.length > 0 ? (
                      rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.mention}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        Tidak ada data kelas tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {/* Show current class if it exists but not in rooms list */}
                {formData.class && !loadingRooms && rooms.length > 0 &&
                 !rooms.some(room => room.id.toString() === formData.class) && (
                  <p className="text-sm text-gray-500">
                    Kelas saat ini: {formData.class}
                  </p>
                )}
              </div>
            )}

            {/* Mentor dropdown - show for both add and edit student */}
            {userRole === "siswa" && (
              <div className="space-y-2">
                <Label htmlFor="mentor">Guru Wali</Label>
                <Select
                  value={loadingMentors ? "" : formData.mentor}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, mentor: value }))
                  }
                  disabled={loadingMentors}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingMentors ? "Memuat data guru Wali..." :
                        formData.mentor ? getMentorName(formData.mentor) : "Pilih guru Wali"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingMentors ? (
                      <SelectItem value="loading" disabled>
                        Memuat data guru Wali...
                      </SelectItem>
                    ) : mentors.length > 0 ? (
                     mentors.map((mentor) => (
                       <SelectItem key={mentor.id || mentor.identifier} value={mentor.id?.toString() || mentor.identifier}>
                         {mentor.name}
                       </SelectItem>
                     ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        Tidak ada data guru Wali tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {/* Show current mentor if it exists but not in mentors list */}
                {formData.mentor && !loadingMentors && mentors.length > 0 &&
                 !mentors.some(m => m.id && m.id.toString() === formData.mentor) && (
                  <p className="text-sm text-gray-500">
                    Guru Wali saat ini: {getMentorName(formData.mentor)}
                  </p>
                )}
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
              disabled={isSubmitting || !isFormValid}
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
