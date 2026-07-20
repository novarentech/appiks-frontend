"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { getReferralById, updateReferralStatus } from "@/lib/mockReferralData";
import { ReferralNotification } from "@/types/notifications";

const mockDates = [
  { date: "Sabtu, 16 Mei 2026", slots: 3 },
  { date: "Senin, 18 Mei 2026", slots: 4 },
  { date: "Selasa, 19 Mei 2026", slots: 4 },
  { date: "Rabu, 20 Mei 2026", slots: 5 },
  { date: "Kamis, 21 Mei 2026", slots: 3 },
  { date: "Jumat, 22 Mei 2026", slots: 1 },
  { date: "Sabtu, 23 Mei 2026", slots: 3 },
  { date: "Minggu, 24 Mei 2026", slots: 3 },
  { date: "Senin, 25 Mei 2026", slots: 4 },
  { date: "Selasa, 26 Mei 2026", slots: 3 },
  { date: "Rabu, 27 Mei 2026", slots: 2 },
  { date: "Kamis, 28 Mei 2026", slots: 5 },
];

const mockTimes = [
  "09:00 - 10:00 WIB",
  "13:00 - 14:00 WIB",
  "15:00 - 16:00 WIB",
];

export default function SchedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [referral, setReferral] = useState<ReferralNotification | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const data = getReferralById(id);
      if (data) {
        setReferral(data);
      } else {
        router.push("/notifications");
      }
    }
  }, [id, router]);

  useEffect(() => {
    // Load from sessionStorage
    const savedDate = sessionStorage.getItem(`schedule_date_${id}`);
    const savedTime = sessionStorage.getItem(`schedule_time_${id}`);
    if (savedDate) setSelectedDate(savedDate);
    if (savedTime) setSelectedTime(savedTime);
  }, [id]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    sessionStorage.setItem(`schedule_date_${id}`, date);
    // Reset time when date changes
    setSelectedTime("");
    sessionStorage.removeItem(`schedule_time_${id}`);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    sessionStorage.setItem(`schedule_time_${id}`, time);
  };

  const handleConfirm = () => {
    // Update status to menunggu konfirmasi from psychologist
    updateReferralStatus(id, "menunggu_konfirmasi", "Menunggu Konfirmasi", "yellow", "border-yellow-400");
    // Clear session storage
    sessionStorage.removeItem(`schedule_date_${id}`);
    sessionStorage.removeItem(`schedule_time_${id}`);
    router.push(`/rujukan/${id}/schedule/success`);
  };

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
            <h3 className="font-semibold text-blue-900">{referral.psychologist}</h3>
            <p className="text-xs sm:text-sm text-blue-600">{referral.location}</p>
            <p className="text-xs text-gray-500 mt-1">Psikologi Klinis Anak & Remaja</p>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-yellow-800">
            Slot tersedia paling cepat tanggal Sabtu, 16 Mei 2026. Sistem memerlukan waktu persiapan minimal 2 hari untuk memproses data Anda.
          </p>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Pilih Tanggal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {mockDates.map((item) => (
              <div
                key={item.date}
                onClick={() => handleDateSelect(item.date)}
                className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                  selectedDate === item.date
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <h4 className={`font-semibold text-sm ${selectedDate === item.date ? "text-gray-900" : "text-gray-800"}`}>
                  {item.date}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{item.slots} slot tersedia</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">Pilih Waktu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {mockTimes.map((time) => (
              <div
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`border rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  selectedTime === time
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                } ${!selectedDate && "opacity-50 cursor-not-allowed"}`}
                style={!selectedDate ? { pointerEvents: "none" } : {}}
              >
                <span className="text-sm">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button & Confirmation Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-6 rounded-xl"
              disabled={!selectedDate || !selectedTime}
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
                  <p className="font-bold text-gray-900 text-sm sm:text-base">{referral.psychologist}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{referral.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tanggal</p>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">{selectedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Waktu</p>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">{selectedTime}</p>
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
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-6 rounded-xl font-medium"
                    onClick={handleConfirm}
                  >
                    Konfirmasi Booking
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
