"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { getCounselingList, getReferralAvailableDates, getReferralAvailableSlots, bookReferralSchedule } from "@/lib/api";
import { ReferralNotification } from "@/types/notifications";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SchedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [referral, setReferral] = useState<ReferralNotification | null>(null);
  const [psychologist, setPsychologist] = useState<any>(null);
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [earliestDate, setEarliestDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  useEffect(() => {
    const fetchReferral = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [counselingResponse, datesResponse] = await Promise.all([
          getCounselingList("external"),
          getReferralAvailableDates(id)
        ]);

        if (datesResponse.success && datesResponse.data) {
          setPsychologist(datesResponse.data.psychologist);
          setAvailableDates(datesResponse.data.available_dates || []);
          setEarliestDate(datesResponse.data.earliest_available_date);
        }

        if (counselingResponse.success && counselingResponse.data) {
          const item = counselingResponse.data.find((c: any) => c.id === id);
          if (item) {
            setReferral({
              id: item.id,
              type: "rujukan",
              title: "Rujukan Psikolog",
              description: "Kamu dirujuk ke psikolog untuk penanganan lebih lanjut.",
              teacher: item.counselor?.name || "Guru BK",
              date: new Date(item.created_at).toLocaleDateString("id-ID"),
              status: item.status,
              statusText: item.status,
              statusColor: "gray",
              borderColor: "border-gray-400",
              icon: User,
              isNew: false,
              psychologist: "Psikolog Eksternal", // Use generic name as payload might not have it
              location: item.room || "Klinik / Platform Eksternal",
              counselor: item.counselor?.name || "Guru BK",
              referralReason: item.reason || "Penanganan lebih lanjut",
              referralDate: new Date(item.created_at).toLocaleDateString("id-ID"),
            });
          } else {
            toast.error("Data rujukan tidak ditemukan");
            router.push("/notifications");
          }
        }
      } catch (error) {
        console.error("Error fetching referral:", error);
        toast.error("Gagal mengambil data rujukan");
        router.push("/notifications");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferral();
  }, [id, router]);

  useEffect(() => {
    // Load from sessionStorage
    const savedDate = sessionStorage.getItem(`schedule_date_${id}`);
    if (savedDate) {
      handleDateSelect(savedDate, false);
    }
  }, [id]);

  const handleDateSelect = async (dateRaw: string, clearSlot: boolean = true) => {
    setSelectedDate(dateRaw);
    sessionStorage.setItem(`schedule_date_${id}`, dateRaw);
    if (clearSlot) {
      setSelectedSlot(null);
      sessionStorage.removeItem(`schedule_slot_${id}`);
    }
    
    try {
      setSlotsLoading(true);
      const res = await getReferralAvailableSlots(id, dateRaw);
      if (res.success && res.data) {
        // Handle both possible structures (data.time_slots or just array in data)
        const slotsArray = res.data.time_slots || (Array.isArray(res.data) ? res.data : []);
        setAvailableSlots(slotsArray);
      }
    } catch (error) {
      toast.error("Gagal mengambil jadwal");
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    sessionStorage.setItem(`schedule_slot_${id}`, JSON.stringify(slot));
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    
    try {
      setIsSubmitting(true);
      const res = await bookReferralSchedule(id, selectedSlot.slot_id || selectedSlot.id);
      if (res.success) {
        toast.success("Berhasil mengajukan jadwal");
        sessionStorage.removeItem(`schedule_date_${id}`);
        sessionStorage.removeItem(`schedule_slot_${id}`);
        router.push(`/rujukan/${id}/schedule/success`);
      } else {
        toast.error(res.message || "Gagal mengajukan jadwal");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!referral) return null;

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group mb-8"
        onClick={() => router.back()}
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Kembali
      </Button>

      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 relative">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Pilih Jadwal Konsultasi
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Pilih waktu yang sesuai dengan jadwal Anda untuk konsultasi dengan psikolog mitra
          </p>
        </div>

        {/* Doctor Card */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">{psychologist?.name || referral.psychologist}</h3>
            <p className="text-xs sm:text-sm text-blue-600">{psychologist?.facility_name || referral.location}</p>
            <p className="text-xs text-gray-500 mt-1">{psychologist?.specialization || "Psikologi Klinis"}</p>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-yellow-800">
            {earliestDate ? `Slot tersedia paling cepat tanggal ${new Date(earliestDate).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. ` : ""}
            Sistem memerlukan waktu persiapan minimal 2 hari untuk memproses data Anda.
          </p>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Pilih Tanggal</h2>
          {availableDates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {availableDates.map((item: any) => (
                <div
                  key={item.date_raw}
                  onClick={() => item.is_selectable && handleDateSelect(item.date_raw)}
                  className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedDate === item.date_raw
                      ? "border-indigo-500 bg-indigo-50/50"
                      : !item.is_selectable 
                        ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <h4 className={`font-semibold text-sm ${selectedDate === item.date_raw ? "text-gray-900" : "text-gray-800"}`}>
                    {item.date_formatted}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{item.slot_label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-500">Tidak ada tanggal tersedia untuk saat ini.</p>
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Pilih Waktu</h2>
          
          {!selectedDate ? (
            <div className="text-center p-6 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-500">Silakan pilih tanggal terlebih dahulu</p>
            </div>
          ) : slotsLoading ? (
            <div className="flex justify-center items-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {availableSlots.map((slot) => (
                <div
                  key={slot.slot_id || slot.id}
                  onClick={() => slot.is_available && handleSlotSelect(slot)}
                  className={`border rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    selectedSlot?.slot_id === slot.slot_id
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                      : !slot.is_available
                        ? "border-gray-200 bg-gray-50 text-gray-400 opacity-50 cursor-not-allowed"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  <span className="text-sm">{slot.time_range || slot.time_formatted || slot.start_time || slot.time || `Slot ${slot.slot_id}`}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-gray-500">Tidak ada slot tersedia pada tanggal ini.</p>
            </div>
          )}
        </div>

        {/* Action Button & Confirmation Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-6 rounded-xl disabled:bg-indigo-300 disabled:cursor-not-allowed"
              disabled={!selectedDate || !selectedSlot}
            >
              Ajukan Jadwal
            </Button>
          </DialogTrigger>

          <DialogContent className="p-0 overflow-hidden bg-white border-0 rounded-2xl" size="lg">
            <div className="p-6 sm:p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  Konfirmasi Jadwal Konsultasi
                </DialogTitle>
              </DialogHeader>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Psikolog</p>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">{psychologist?.name || referral.psychologist}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{psychologist?.facility_name || referral.location}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Jadwal Terpilih</p>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    {availableDates.find((d: any) => d.date_raw === selectedDate)?.date_formatted || selectedDate}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">{selectedSlot?.time_range || selectedSlot?.time_formatted || selectedSlot?.start_time || selectedSlot?.time}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 mb-8">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-yellow-800">
                  Jadwal ini bersifat tentative dan menunggu konfirmasi dari psikolog dalam 24 jam. Anda akan menerima notifikasi setelah psikolog mengonfirmasi.
                </p>
              </div>

              <DialogFooter className="grid grid-cols-2 gap-3 sm:gap-2 ">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-6 rounded-xl font-medium"
                  >
                    Batal
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl font-semibold"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Ya, Konfirmasi
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
