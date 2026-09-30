import { Referral } from "@/types/api";
import Link from "next/link";
import {
  User,
  Calendar,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  AlertOctagon,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { decideReferral, getReferralAvailableDates, getReferralAvailableSlots, bookReferralSchedule } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReferralCardProps {
  referral: Referral;
  onActionSuccess?: () => void;
}

export default function ReferralCard({ referral, onActionSuccess }: ReferralCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  useEffect(() => {
    if (isRescheduleOpen) {
      const fetchDates = async () => {
        setIsLoadingDates(true);
        try {
          const res = await getReferralAvailableDates(Number(referral.counseling_id));
          if (res.success && res.data) {
            setAvailableDates(res.data.available_dates || []);
            setSelectedDate("");
            setSelectedSlot(null);
            setAvailableSlots([]);
          }
        } catch (error) {
          console.error(error);
          toast.error("Gagal mengambil daftar tanggal");
        } finally {
          setIsLoadingDates(false);
        }
      };
      fetchDates();
    }
  }, [isRescheduleOpen, referral.counseling_id]);

  const handleDateSelect = async (dateRaw: string) => {
    setSelectedDate(dateRaw);
    setSelectedSlot(null);
    setAvailableSlots([]);
    
    try {
      setIsLoadingSlots(true);
      const res = await getReferralAvailableSlots(Number(referral.counseling_id), dateRaw);
      if (res.success && res.data) {
        const slotsArray = res.data.time_slots || (Array.isArray(res.data) ? res.data : []);
        setAvailableSlots(slotsArray);
      }
    } catch (error) {
      toast.error("Gagal mengambil jadwal");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedSlot) {
      toast.error("Silakan pilih jadwal pengganti");
      return;
    }
    if (!rescheduleReason.trim()) {
      toast.error("Alasan pengajuan harus diisi");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await decideReferral(referral.id, {
        action: "confirm",
        reschedule_reason: rescheduleReason,
        slot_id: Number(selectedSlot.slot_id || selectedSlot.id)
      });
      if (response.success) {
        toast.success("Pengajuan perubahan jadwal berhasil dikirim");
        setIsRescheduleOpen(false);
        if (onActionSuccess) onActionSuccess();
        else window.location.reload();
      } else {
        toast.error(response.message || "Gagal mengajukan perubahan jadwal");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengajukan perubahan jadwal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      const response = await decideReferral(referral.id, { action: "confirm" });
      if (response.success) {
        toast.success("Jadwal konseling berhasil dikonfirmasi");
        setIsConfirmOpen(false);
        if (onActionSuccess) {
          onActionSuccess();
        } else {
          window.location.reload();
        }
      } else {
        toast.error(response.message || "Gagal mengkonfirmasi jadwal");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengkonfirmasi jadwal");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Determine colors based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Kritis":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      case "Prioritas":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  // Determine colors based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      case "Dijadwalkan":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "Selesai":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "Ditolak":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
      case "Expired":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const showTimer = referral.status === "Menunggu";

  // Helper to format date if it's an ISO string
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    if (dateStr.includes("T")) {
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch (e) {
        return dateStr;
      }
    }
    return dateStr;
  };

  return (
    <Card className="p-5 flex flex-col w-full transition-all duration-200">
      <div className="flex flex-col md:flex-row gap-4 items-start w-full">
        {/* Left side: Avatar and Basic Info */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 text-red-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{referral.student_name}</h3>
            </div>
          </div>

          {/* Details badges */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(referral.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span>{referral.time}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Guru BK : {referral.referrer_name}</span>
            </div>
          </div>

          {/* Expand button (Visible only when NOT expanded) */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline mt-2"
            >
              <span>Lihat Selengkapnya</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side: Status and Badges */}
        <div className="flex flex-col items-end gap-2 shrink-0 self-start w-full md:w-auto mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`font-normal border-0 flex items-center gap-1 ${getPriorityColor(referral.priority)}`}
            >
              {referral.priority === "Kritis" && <AlertOctagon className="w-3.5 h-3.5" />}
              {referral.priority === "Prioritas" && <AlertTriangle className="w-3.5 h-3.5" />}
              {referral.priority !== "Kritis" && referral.priority !== "Prioritas" && <Info className="w-3.5 h-3.5" />}
              {referral.priority}
            </Badge>
            <Badge
              variant="secondary"
              className={`font-normal border-0 ${getStatusColor(referral.status)}`}
            >
              {referral.status}
            </Badge>
          </div>

          {showTimer && (
            <div className="text-right mt-1">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
                Sisa Waktu Respon
              </p>
              <p className="text-red-500 font-semibold">
                {referral.remaining_time}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Catatan Awal Guru BK :
            </h4>
            <p className="text-sm text-gray-600 italic">
              "{referral.counselor_notes}"
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Diajukan pada : {formatDate(referral.submitted_at)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {(referral.status === "Menunggu" || referral.status === "Expired") && (
                <>
                  <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white min-w-[120px]"
                        disabled={referral.is_expired || referral.status === "Expired"}
                      >
                        Konfirmasi
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Konfirmasi Jadwal Konsultasi</DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                          Apakah Anda yakin akan mengkonfirmasi jadwal konsultasi ini? Setelah dikonfirmasi notifikasi akan dikirim ke siswa dan Guru BK.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="bg-gray-50 border rounded-lg p-4 my-2">
                        <div className="mb-3">
                          <Label className="text-xs text-gray-500">Tanggal</Label>
                          <p className="text-sm font-medium text-gray-800">{referral.date}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Waktu</Label>
                          <p className="text-sm font-medium text-gray-800">{referral.time}</p>
                        </div>
                      </div>
                      <DialogFooter className="flex gap-3 pt-2 sm:justify-between">
                        <Button variant="outline" className="flex-1" onClick={() => setIsConfirmOpen(false)} disabled={isSubmitting}>
                          Batal
                        </Button>
                        <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white" onClick={handleConfirm} disabled={isSubmitting}>
                          {isSubmitting ? "Memproses..." : "Ya, Konfirmasi"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-500 hover:bg-indigo-50 min-w-[120px]"
                    disabled={referral.is_expired || referral.status === "Expired"}
                    onClick={() => setIsRescheduleOpen(true)}
                  >
                    Ubah Jadwal
                  </Button>
                </>
              )}

              {referral.status === "Dijadwalkan" && (
                <>
                  <Link href={`/dashboard/rujukan-masuk/${referral.counseling_id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]">
                      Buka Laporan AI
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-500 hover:bg-indigo-50 min-w-[120px]"
                    onClick={() => setIsRescheduleOpen(true)}
                  >
                    Ubah Jadwal
                  </Button>
                </>
              )}

              {referral.status === "Selesai" && (
                <Link href={`/dashboard/rujukan-masuk/${referral.counseling_id}`}>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 min-w-[120px]"
                  >
                    Lihat Laporan
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
          >
            <ChevronUp className="w-4 h-4" />
            <span>Sembunyikan</span>
          </button>
        </div>
      )}


      {/* Shared Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajukan Perubahan Jadwal</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Pilih jadwal pengganti dari slot waktu yang telah Anda sediakan. Siswa dan Guru BK akan menerima notifikasi mengenai perubahan jadwal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-2">
            {/* Date Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-800 mb-2 block">
                Pilih Tanggal <span className="text-red-500">*</span>
              </Label>
              {isLoadingDates ? (
                <div className="text-sm text-gray-500">Memuat tanggal...</div>
              ) : availableDates.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {availableDates.map((item: any) => (
                    <div
                      key={item.date_raw}
                      onClick={() => item.is_selectable && handleDateSelect(item.date_raw)}
                      className={`border rounded-xl p-3 cursor-pointer transition-colors ${
                        selectedDate === item.date_raw
                          ? "border-indigo-500 bg-indigo-50/50"
                          : !item.is_selectable 
                            ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <h4 className={`font-semibold text-xs ${selectedDate === item.date_raw ? "text-gray-900" : "text-gray-800"}`}>
                        {item.date_formatted}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.slot_label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500 border rounded-lg p-3 text-center bg-gray-50">
                  Tidak ada tanggal tersedia
                </div>
              )}
            </div>
            
            {/* Time Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-800 mb-2 block">
                Pilih Waktu <span className="text-red-500">*</span>
              </Label>
              {!selectedDate ? (
                <div className="text-xs text-gray-500 border rounded-lg p-3 text-center bg-gray-50">
                  Silakan pilih tanggal terlebih dahulu
                </div>
              ) : isLoadingSlots ? (
                <div className="text-sm text-gray-500">Memuat waktu...</div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.slot_id || slot.id}
                      onClick={() => slot.is_available && setSelectedSlot(slot)}
                      className={`border rounded-xl p-3 text-center cursor-pointer transition-colors ${
                        selectedSlot && ((slot.slot_id && selectedSlot.slot_id === slot.slot_id) || (slot.id && selectedSlot.id === slot.id))
                          ? "border-indigo-500 bg-indigo-50/50"
                          : !slot.is_available
                            ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className={`font-semibold text-xs ${selectedSlot && ((slot.slot_id && selectedSlot.slot_id === slot.slot_id) || (slot.id && selectedSlot.id === slot.id)) ? "text-gray-900" : !slot.is_available ? "text-gray-400" : "text-gray-800"}`}>
                        {slot.time_range || slot.time_formatted || slot.start_time || slot.time || `Slot ${slot.slot_id || slot.id}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500 border rounded-lg p-3 text-center bg-gray-50">
                  Tidak ada slot tersedia
                </div>
              )}
            </div>

            <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2">
              <Label className="text-sm font-medium text-gray-800 mb-1 block">
                Alasan Pengajuan <span className="text-red-500">*</span>
              </Label>
              <Textarea 
                placeholder="Jelaskan alasan perubahan jadwal"
                className="min-h-[80px]"
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
              />
            </div>

            <p className="text-[11px] text-orange-500">
              Jadwal yang diajukan akan segera dikirim ke sistem untuk diproses.
            </p>
          </div>
          <DialogFooter className="flex gap-3 pt-2 sm:justify-between">
            <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-100" onClick={() => setIsRescheduleOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleReschedule} disabled={isSubmitting || !selectedSlot}>
              {isSubmitting ? "Memproses..." : "Ajukan Jadwal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
