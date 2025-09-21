"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

// Types
interface CounselingSchedule {
  id: number;
  siswa: {
    nama: string;
    nisn: string;
    kelas: string;
  };
  topikKonseling: string;
  status:
    | "menunggu"
    | "disetujui"
    | "dijadwalkanUlang"
    | "selesai"
    | "dibatalkan";
  prioritas: "rendah" | "sedang" | "tinggi";
  waktuDiajukan: string;
  jadwalKonseling?: {
    tanggal: string;
    waktu: string;
    guruBK: string;
    ruangan: string;
  };
  catatanKonfirmasi?: string;
  alasanPembatalan?: string;
  hasilKonseling?: string;
}

interface CounselingScheduleDialogProps {
  schedule: CounselingSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    scheduleId: number,
    action: string,
    data?: Record<string, unknown>
  ) => void;
  dialogType: "confirm" | "reschedule" | "complete" | "cancel";
}

export default function CounselingScheduleDialog({
  schedule,
  isOpen,
  onClose,
  onUpdate,
  dialogType,
}: CounselingScheduleDialogProps) {
  const [formData, setFormData] = useState({
    tanggal: undefined as Date | undefined,
    waktu: "",
    guruBK: "",
    ruangan: "",
    catatan: "",
    hasilKonseling: "",
    alasanPembatalan: "",
  });

  useEffect(() => {
    if (schedule && isOpen) {
      // Initialize form data based on existing schedule
      let existingDate: Date | undefined = undefined;
      if (schedule.jadwalKonseling?.tanggal) {
        const [day, month, year] = schedule.jadwalKonseling.tanggal.split("/");
        existingDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
      }

      setFormData({
        tanggal: existingDate,
        waktu: schedule.jadwalKonseling?.waktu || "",
        guruBK: schedule.jadwalKonseling?.guruBK || "Sri Wahyuni, S.Pd, M.Pd",
        ruangan: schedule.jadwalKonseling?.ruangan || "",
        catatan: schedule.catatanKonfirmasi || "",
        hasilKonseling: schedule.hasilKonseling || "",
        alasanPembatalan: schedule.alasanPembatalan || "",
      });
    }
  }, [schedule, isOpen]);

  const handleSubmit = () => {
    if (!schedule) return;

    let submitData: Record<string, unknown> = {};

    switch (dialogType) {
      case "confirm":
        submitData = {
          tanggal: format(new Date(), "dd/MM/yyyy"),
          waktu: format(new Date(), "HH:mm"),
          guruBK: formData.guruBK,
          ruangan: formData.ruangan,
          catatan: formData.catatan,
        };
        break;
      case "reschedule":
        if (formData.tanggal && formData.waktu) {
          submitData = {
            tanggal: format(formData.tanggal, "dd/MM/yyyy"),
            waktu: formData.waktu,
            guruBK: formData.guruBK,
            ruangan: formData.ruangan,
          };
        }
        break;
      case "complete":
        submitData = {
          hasilKonseling: formData.hasilKonseling,
        };
        break;
      case "cancel":
        submitData = {
          alasanPembatalan: formData.alasanPembatalan,
        };
        break;
    }

    onUpdate(schedule.id, dialogType, submitData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      tanggal: undefined,
      waktu: "",
      guruBK: "",
      ruangan: "",
      catatan: "",
      hasilKonseling: "",
      alasanPembatalan: "",
    });
    onClose();
  };

  const getDialogTitle = () => {
    switch (dialogType) {
      case "confirm":
        return "Konfirmasi Jadwal Konseling";
      case "reschedule":
        return "Jadwalkan Ulang Konseling";
      case "complete":
        return "Selesaikan Konseling";
      case "cancel":
        return "Batalkan Konseling";
      default:
        return "Kelola Jadwal Konseling";
    }
  };

  const getDialogIcon = () => {
    switch (dialogType) {
      case "confirm":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "reschedule":
        return <RotateCcw className="w-5 h-5 text-orange-600" />;
      case "complete":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "cancel":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const isFormValid = () => {
    switch (dialogType) {
      case "confirm":
        return formData.ruangan.trim() !== "";
      case "reschedule":
        return formData.tanggal && formData.waktu.trim() !== "";
      case "complete":
        return formData.hasilKonseling.trim() !== "";
      case "cancel":
        return formData.alasanPembatalan.trim() !== "";
      default:
        return false;
    }
  };

  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-2">
            {getDialogIcon()}
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Student Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">
              {schedule.topikKonseling}
            </h4>
            <div className="text-sm text-gray-600">
              <p>
                Siswa: {schedule.siswa.nama} ({schedule.siswa.kelas})
              </p>
              <p>Diajukan: {schedule.waktuDiajukan}</p>
            </div>
          </div>

          {/* Form Fields */}
          {dialogType === "confirm" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="guruBK">Guru BK</Label>
                <Input
                  id="guruBK"
                  value={formData.guruBK}
                  onChange={(e) =>
                    setFormData({ ...formData, guruBK: e.target.value })
                  }
                  placeholder="Nama Guru BK"
                />
              </div>
              <div>
                <Label htmlFor="ruangan">Ruangan *</Label>
                <Input
                  id="ruangan"
                  value={formData.ruangan}
                  onChange={(e) =>
                    setFormData({ ...formData, ruangan: e.target.value })
                  }
                  placeholder="Ruangan konseling"
                />
              </div>
              <div>
                <Label htmlFor="catatan">Catatan Konfirmasi</Label>
                <Textarea
                  id="catatan"
                  value={formData.catatan}
                  onChange={(e) =>
                    setFormData({ ...formData, catatan: e.target.value })
                  }
                  placeholder="Catatan untuk siswa"
                />
              </div>
            </div>
          )}

          {dialogType === "reschedule" && (
            <div className="space-y-4">
              <div>
                <Label>Tanggal Baru *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.tanggal ? (
                        format(formData.tanggal, "dd/MM/yyyy")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal}
                      onSelect={(date) =>
                        setFormData({ ...formData, tanggal: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="waktu">Waktu *</Label>
                <Select
                  value={formData.waktu}
                  onValueChange={(value) =>
                    setFormData({ ...formData, waktu: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="13:00 PM">13:00 PM</SelectItem>
                    <SelectItem value="14:00 PM">14:00 PM</SelectItem>
                    <SelectItem value="15:00 PM">15:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guruBK">Guru BK</Label>
                <Input
                  id="guruBK"
                  value={formData.guruBK}
                  onChange={(e) =>
                    setFormData({ ...formData, guruBK: e.target.value })
                  }
                  placeholder="Nama Guru BK"
                />
              </div>
              <div>
                <Label htmlFor="ruangan">Ruangan</Label>
                <Input
                  id="ruangan"
                  value={formData.ruangan}
                  onChange={(e) =>
                    setFormData({ ...formData, ruangan: e.target.value })
                  }
                  placeholder="Ruangan konseling"
                />
              </div>
            </div>
          )}

          {dialogType === "complete" && (
            <div>
              <Label htmlFor="hasilKonseling">Hasil Konseling *</Label>
              <Textarea
                id="hasilKonseling"
                value={formData.hasilKonseling}
                onChange={(e) =>
                  setFormData({ ...formData, hasilKonseling: e.target.value })
                }
                placeholder="Tuliskan hasil dan kesimpulan dari sesi konseling"
                className="min-h-[100px]"
              />
            </div>
          )}

          {dialogType === "cancel" && (
            <div>
              <Label htmlFor="alasanPembatalan">Alasan Pembatalan *</Label>
              <Textarea
                id="alasanPembatalan"
                value={formData.alasanPembatalan}
                onChange={(e) =>
                  setFormData({ ...formData, alasanPembatalan: e.target.value })
                }
                placeholder="Jelaskan alasan pembatalan konseling"
                className="min-h-[100px]"
              />
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={
              dialogType === "cancel"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            {dialogType === "confirm" && "Konfirmasi"}
            {dialogType === "reschedule" && "Jadwalkan Ulang"}
            {dialogType === "complete" && "Selesaikan"}
            {dialogType === "cancel" && "Batalkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
