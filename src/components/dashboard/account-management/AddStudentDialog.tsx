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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createStudent, getUsersByType, getRooms } from "@/lib/api";
import { User, RoomData } from "@/types/api";
import { toast } from "sonner";
import {
  UserPlus,
  Users,
  UserCheck,
  DoorOpen,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddStudentDialog({ open, onOpenChange, onSuccess }: AddStudentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    identifier: "",
    mentor_id: "",
    counselor_id: "",
    room_id: "",
  });

  const [mentors, setMentors] = useState<User[]>([]);
  const [counselors, setCounselors] = useState<User[]>([]);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load dropdown data
  useEffect(() => {
    const loadData = async () => {
      if (!open) return;

      setLoadingData(true);
      try {
        const [mentorsRes, counselorsRes, roomsRes] = await Promise.all([
          getUsersByType("teacher"),
          getUsersByType("counselor"),
          getRooms(),
        ]);

        if (mentorsRes.success) {
          setMentors(mentorsRes.data);
        }
        if (counselorsRes.success) {
          setCounselors(counselorsRes.data);
        }
        if (roomsRes.success) {
          setRooms(roomsRes.data);
        }
      } catch (error) {
        console.error("Error loading dropdown data:", error);
        toast.error("Gagal memuat data dropdown");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama siswa wajib diisi";
    }

    if (!formData.identifier.trim()) {
      newErrors.identifier = "NISN wajib diisi";
    } else if (!/^\d+$/.test(formData.identifier)) {
      newErrors.identifier = "NISN harus berupa angka";
    }

    if (!formData.mentor_id) {
      newErrors.mentor_id = "Guru wali wajib dipilih";
    }

    if (!formData.counselor_id) {
      newErrors.counselor_id = "Guru BK wajib dipilih";
    }

    if (!formData.room_id) {
      newErrors.room_id = "Kelas wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await createStudent(formData);
      toast.success("Siswa berhasil ditambahkan");
      
      // Reset form
      setFormData({
        name: "",
        identifier: "",
        mentor_id: "",
        counselor_id: "",
        room_id: "",
      });
      setErrors({});
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Error creating student:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal menambahkan siswa";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <UserPlus className="w-4 h-4 text-blue-600" />
            </div>
            <span>Tambah Akun Siswa</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name" className="flex items-center space-x-2">
                <span>Nama Lengkap</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Masukkan nama lengkap siswa"
                className={errors.name ? "border-red-500" : ""}
                disabled={loadingData || loading}
              />
              {errors.name && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* NISN Field */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="flex items-center space-x-2">
                <span>NISN</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="identifier"
                value={formData.identifier}
                onChange={(e) => handleInputChange("identifier", e.target.value)}
                placeholder="Masukkan NISN siswa"
                className={errors.identifier ? "border-red-500" : ""}
                disabled={loadingData || loading}
              />
              {errors.identifier && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.identifier}</span>
                </div>
              )}
            </div>

            {/* Mentor Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="mentor_id" className="flex items-center space-x-2">
                <span>Guru Wali</span>
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.mentor_id}
                onValueChange={(value) => handleInputChange("mentor_id", value)}
                disabled={loadingData || loading}
              >
                <SelectTrigger className={`w-full ${errors.mentor_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Pilih guru wali" />
                </SelectTrigger>
                <SelectContent>
                  {loadingData ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memuat data...</span>
                      </div>
                    </SelectItem>
                  ) : mentors.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Tidak ada data guru wali
                    </SelectItem>
                  ) : (
                    mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id?.toString() || ""}>
                        {mentor.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.mentor_id && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.mentor_id}</span>
                </div>
              )}
            </div>

            {/* Counselor Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="counselor_id" className="flex items-center space-x-2">
                <span>Guru BK</span>
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.counselor_id}
                onValueChange={(value) => handleInputChange("counselor_id", value)}
                disabled={loadingData || loading}
              >
                <SelectTrigger className={`w-full ${errors.counselor_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Pilih guru BK" />
                </SelectTrigger>
                <SelectContent>
                  {loadingData ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memuat data...</span>
                      </div>
                    </SelectItem>
                  ) : counselors.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Tidak ada data guru BK
                    </SelectItem>
                  ) : (
                    counselors.map((counselor) => (
                      <SelectItem key={counselor.id} value={counselor.id?.toString() || ""}>
                        {counselor.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.counselor_id && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.counselor_id}</span>
                </div>
              )}
            </div>

            {/* Room Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="room_id" className="flex items-center space-x-2">
                <span>Kelas</span>
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.room_id}
                onValueChange={(value) => handleInputChange("room_id", value)}
                disabled={loadingData || loading}
              >
                <SelectTrigger className={`w-full ${errors.room_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {loadingData ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memuat data...</span>
                      </div>
                    </SelectItem>
                  ) : rooms.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Tidak ada data kelas
                    </SelectItem>
                  ) : (
                    rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id?.toString() || ""}>
                        {room.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.room_id && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.room_id}</span>
                </div>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || loadingData || !formData.name || !formData.identifier || !formData.mentor_id || !formData.counselor_id || !formData.room_id}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Siswa
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
