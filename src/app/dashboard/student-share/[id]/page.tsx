"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSharingDetail, markSharingFalsePositive, replySharing } from "@/lib/api";
import { Sharing } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Loader2, AlertTriangle, ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";

export default function DetailCurhatanPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [data, setData] = useState<Sharing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [falsePositiveReason, setFalsePositiveReason] = useState("");
  const [isFalsePositiveSubmitting, setIsFalsePositiveSubmitting] = useState(false);
  const [isFalsePositiveOpen, setIsFalsePositiveOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isHandling, setIsHandling] = useState(false);
  const [isStartHandlingOpen, setIsStartHandlingOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleRoom, setScheduleRoom] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");
  const [isScheduleSubmitting, setIsScheduleSubmitting] = useState(false);

  // Helper functions
  const mapPriorityToStatus = (priority: string) => {
    const p = priority?.toLowerCase() || "rendah";
    if (p === "tinggi" || p === "kritis") return "Kritis";
    if (p === "sedang" || p === "prioritas") return "Prioritas";
    return "Aman";
  };

  const getApiStatusBadgeVariant = (status: string) => {
    const s = status?.toLowerCase() || "menunggu";
    switch (s) {
      case "dijadwalkan":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "menunggu":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "selesai":
        return "bg-green-50 text-green-700 border-green-200";
      case "ditolak":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getKeywords = (text: string) => {
    const keywords: string[] = [];
    const textLower = text.toLowerCase();
    if (textLower.includes("bunuh diri") || textLower.includes("mati"))
      keywords.push("bunuh diri");
    if (textLower.includes("tidak ingin hidup"))
      keywords.push("tidak ingin hidup");
    if (textLower.includes("menyakiti") || textLower.includes("sakit"))
      keywords.push("menyakiti diri");
    if (textLower.includes("stres") || textLower.includes("stress"))
      keywords.push("stres");
    if (textLower.includes("malas")) keywords.push("malas");
    if (textLower.includes("capek") || textLower.includes("lelah"))
      keywords.push("lelah");
    
    // Default mock if none found but status is critical/priority
    if (keywords.length === 0) {
       const status = mapPriorityToStatus(data?.priority || "");
       if (status === "Kritis") return ["bunuh diri", "tidak ingin hidup", "menyakiti diri"];
       if (status === "Prioritas") return ["stres", "malas"];
    }
    return keywords;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSharingDetail(id);
        if (result.success) {
          // Handle new API response where data might be an array
          let item = null;
          if (Array.isArray(result.data)) {
            // Find the specific item by ID, or fallback to the first item
            item = result.data.find((d: Sharing) => d.id === id) || result.data[0];
          } else {
            item = result.data;
          }
          setData(item);
        } else {
          setError(result.message || "Gagal mengambil data detail");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (!data) return;
    const status = mapPriorityToStatus(data.priority);
    if (status === "Aman") return;

    // Timer logic
    const createdAt = new Date(data.created_at).getTime();
    const hoursToAdd = status === "Kritis" ? 2 : 48;
    const targetTime = createdAt + hoursToAdd * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const handleFalsePositiveSubmit = async () => {
    if (!falsePositiveReason.trim()) return;
    
    try {
      setIsFalsePositiveSubmitting(true);
      const res = await markSharingFalsePositive(id, falsePositiveReason);
      if (res.success) {
        setIsFalsePositiveOpen(false);
        setFalsePositiveReason("");
        window.location.reload();
      } else {
        alert(res.message || "Gagal mengubah status.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsFalsePositiveSubmitting(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    
    try {
      setIsReplySubmitting(true);
      const res = await replySharing(id, replyText);
      if (res.success) {
        setIsReplyOpen(false);
        setReplyText("");
        window.location.reload();
      } else {
        alert(res.message || "Gagal mengirim balasan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsReplySubmitting(false);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleDate || !scheduleTime || !scheduleRoom) return;
    setIsScheduleSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsScheduleSubmitting(false);
      setIsScheduleOpen(false);
      alert("Pertemuan konseling berhasil diajukan!");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Data tidak ditemukan"}
        </div>
      </div>
    );
  }

  const status = mapPriorityToStatus(data.priority);
  const keywords = getKeywords(data.title + " " + data.description);

  // Status Configurations
  const config = {
    Kritis: {
      alertBorder: "border-red-300",
      alertBg: "bg-red-50",
      alertIconColor: "text-red-500",
      alertTitle: "Tindakan Segera Diperlukan",
      alertTitleColor: "text-red-600",
      alertDesc: "Kasus ini memerlukan penanganan dan tindak lanjut segera.",
      statusBadge: "bg-yellow-50 text-yellow-600 border-yellow-200", // Belum Ditinjau
      primaryBtn: "bg-[#e53e51] hover:bg-red-600 text-white", // Red primary
      primaryBtnText: "Mulai Tangani",
      secondaryBtn: "border-[#e53e51] text-[#e53e51] hover:bg-red-50",
      secondaryBtnText: "Bukan Kondisi Kritis",
    },
    Prioritas: {
      alertBorder: "border-orange-300",
      alertBg: "bg-orange-50",
      alertIconColor: "text-orange-500",
      alertTitle: "Perlu Tindak Lanjut",
      alertTitleColor: "text-orange-600",
      alertDesc: "Sistem mendeteksi indikasi tekanan emosional atau psikologis yang perlu ditinjau lebih lanjut.",
      statusBadge: "bg-yellow-50 text-yellow-600 border-yellow-200", // Belum Ditinjau
      primaryBtn: "bg-[#e53e51] hover:bg-red-600 text-white", // Red primary in mockup
      primaryBtnText: "Mulai Tangani",
      secondaryBtn: "border-[#e53e51] text-[#e53e51] hover:bg-red-50",
      secondaryBtnText: "Bukan Kondisi Prioritas",
    },
    Aman: {
      alertBorder: "border-green-300",
      alertBg: "bg-green-50",
      alertIconColor: "text-green-500",
      alertTitle: "Curhatan Aman",
      alertTitleColor: "text-green-600",
      alertDesc: "Sistem tidak mendeteksi indikasi kondisi darurat atau risiko tinggi pada curhatan siswa.",
      statusBadge: "bg-yellow-50 text-yellow-600 border-yellow-200", // Belum Ditanggapi
      primaryBtn: "bg-blue-600 hover:bg-blue-700 text-white w-full",
      primaryBtnText: "Balas Curhat",
      secondaryBtn: "hidden",
      secondaryBtnText: "",
    },
  };

  const currentConfig = config[status as keyof typeof config];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6 lg:p-8">
        {/* Header Alert */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Detail Alert Siswa</h2>
            <p className="text-gray-500 text-sm">
              Kasus ini memerlukan penanganan dan tindak lanjut segera.
            </p>
          </div>
          {status !== "Aman" && (
            <div className="text-right">
              <div className="text-xs font-bold text-red-500 mb-1">BATAS TINDAK LANJUT</div>
              <div className="text-xl font-bold text-red-500 tracking-wider font-mono">
                {timeLeft || "Loading..."}
              </div>
            </div>
          )}
        </div>

        {/* Alert Box */}
        <div className={`rounded-lg border p-4 mb-8 flex items-start space-x-3 ${currentConfig.alertBg} ${currentConfig.alertBorder}`}>
          {status !== "Aman" && (
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${currentConfig.alertIconColor}`} />
          )}
          <div>
            <div className={`font-semibold mb-1 ${currentConfig.alertTitleColor}`}>
              {currentConfig.alertTitle}
            </div>
            <div className={`text-sm ${currentConfig.alertTitleColor} opacity-80`}>
              {currentConfig.alertDesc}
            </div>
          </div>
        </div>

        {/* Identitas Siswa */}
        <div className="border rounded-lg mb-6">
          <div className="bg-gray-50/50 p-4 border-b font-semibold">Identitas Siswa</div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <div className="text-gray-500 text-xs mb-1">Nama Lengkap</div>
              <div className="font-semibold">{data.user.name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">NIS</div>
              <div className="font-semibold">{data.user.identifier}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Kelas</div>
              <div className="font-semibold">{data.user.room?.name || "-"}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Waktu Trigger</div>
              <div className="font-semibold">
                {new Date(data.created_at).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(data.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-2">Status & Prioritas</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`capitalize font-medium ${getApiStatusBadgeVariant(data.status)}`}>
                  Status: {data.status || "menunggu"}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={
                    status === "Kritis" ? "bg-red-50 text-red-700 border-red-200 font-medium" :
                    status === "Prioritas" ? "bg-orange-50 text-orange-700 border-orange-200 font-medium" :
                    "bg-green-50 text-green-700 border-green-200 font-medium"
                  }
                >
                  Prioritas: {status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Transkrip Curhatan */}
        <div className="border rounded-lg mb-6">
          <div className="bg-gray-50/50 p-4 border-b font-semibold">Transkrip Curhatan</div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-5">
              <div className="font-semibold mb-3">{data.title}</div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
        </div>

        {/* Kata Kunci */}
        {status !== "Aman" && (
          <div className="border rounded-lg mb-8">
            <div className="bg-gray-50/50 p-4 border-b font-semibold">Kata Kunci Terdeteksi</div>
            <div className="p-6 flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-red-50 text-red-600 hover:bg-red-100 font-normal px-3 py-1"
                >
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          {status !== "Aman" && !isHandling ? (
            <Dialog open={isStartHandlingOpen} onOpenChange={setIsStartHandlingOpen}>
              <DialogTrigger asChild>
                <Button className={`${currentConfig.primaryBtn} py-6 text-base font-semibold`}>
                  {currentConfig.primaryBtnText}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-6">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl">Mulai Penanganan Kasus?</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2 text-base">
                    Anda akan mulai menangani laporan ini.<br/>
                    Status kasus akan berubah menjadi &quot;Sedang Ditangani&quot;.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex flex-row gap-3 sm:space-x-0">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-1/2 text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600">
                      Batal
                    </Button>
                  </DialogClose>
                  <Button 
                    className="w-1/2 bg-[#e53e51] hover:bg-red-600 text-white"
                    onClick={() => {
                      setIsHandling(true);
                      setIsStartHandlingOpen(false);
                    }}
                  >
                    Ya, Mulai Tangani
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : status !== "Aman" && isHandling ? (
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#5b61e2] hover:bg-[#4b51d2] text-white py-6 text-base font-semibold">
                  Ajukan Pertemuan Konseling
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-2xl font-bold">Ajukan Pertemuan Konseling</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2 text-base">
                    Buat jadwal pertemuan dengan siswa untuk tindak lanjut kasus ini.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Tanggal <span className="text-red-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full mt-2 justify-start text-left font-normal h-10",
                            !scheduleDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduleDate ? format(scheduleDate, "PPP") : <span>Pilih tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Waktu <span className="text-red-500">*</span></Label>
                    <div className="relative mt-2">
                      <Input 
                        type="time" 
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full h-10 pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-semibold text-gray-700">Ruangan <span className="text-red-500">*</span></Label>
                  <Select value={scheduleRoom} onValueChange={setScheduleRoom}>
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Pilih ruangan..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ruang BK 1">Ruang BK 1</SelectItem>
                      <SelectItem value="Ruang BK 2">Ruang BK 2</SelectItem>
                      <SelectItem value="Klinik Sekolah">Klinik Sekolah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 mb-4">
                  <Label className="text-sm font-semibold text-gray-700">Catatan Tambahan (Opsional)</Label>
                  <Textarea 
                    placeholder="Catatan tambahan..." 
                    className="mt-2 resize-none w-full" 
                    rows={3}
                    value={scheduleNote}
                    onChange={(e) => setScheduleNote(e.target.value)}
                  />
                </div>

                <DialogFooter className="flex flex-row gap-3 sm:space-x-0 w-full">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-1/2 text-[#5b61e2] border-[#5b61e2] hover:bg-blue-50 py-6 text-base font-semibold">
                      Batal
                    </Button>
                  </DialogClose>
                  <Button 
                    className="w-1/2 bg-[#5b61e2] hover:bg-[#4b51d2] text-white py-6 text-base font-semibold"
                    onClick={handleScheduleSubmit}
                    disabled={!scheduleDate || !scheduleTime || !scheduleRoom || isScheduleSubmitting}
                  >
                    {isScheduleSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Proses...</>
                    ) : (
                      "Konfirmasi"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
              <DialogTrigger asChild>
                <Button className={`${currentConfig.primaryBtn} py-6 text-base font-semibold`}>
                  {currentConfig.primaryBtnText}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl">Balas Curhat</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2 text-base">
                    Tuliskan pesan balasan Anda untuk curhatan siswa ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                  <Label htmlFor="replyText" className="text-sm font-semibold text-gray-700">
                    Pesan Balasan <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="replyText"
                    placeholder="Tulis pesan Anda di sini ..."
                    className="mt-2 resize-none w-full"
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={isReplySubmitting}
                  />
                </div>
                <DialogFooter className="mt-2 flex flex-row gap-3 sm:space-x-0">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-1/2 text-gray-700 border-gray-300 hover:bg-gray-50" disabled={isReplySubmitting}>
                      Batal
                    </Button>
                  </DialogClose>
                  <Button 
                    className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleReplySubmit}
                    disabled={isReplySubmitting || !replyText.trim()}
                  >
                    {isReplySubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</>
                    ) : (
                      "Kirim Balasan"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {status !== "Aman" && !isHandling && (
            <Dialog open={isFalsePositiveOpen} onOpenChange={setIsFalsePositiveOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`${currentConfig.secondaryBtn} py-6 text-base font-semibold`}
                >
                  {currentConfig.secondaryBtnText}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl">Bukan Kondisi {status}</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2 text-base">
                    Status {status.toLowerCase()} akan dicabut dari monitoring aktif.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                  <Label htmlFor="reason" className="text-sm font-semibold text-gray-700">
                    Alasan <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Jelaskan alasan pencabutan status ..."
                    className="mt-2 resize-none w-full"
                    rows={4}
                    value={falsePositiveReason}
                    onChange={(e) => setFalsePositiveReason(e.target.value)}
                    disabled={isFalsePositiveSubmitting}
                  />
                </div>
                <DialogFooter className="mt-2 flex flex-row gap-3 sm:space-x-0">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-1/2 text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600" disabled={isFalsePositiveSubmitting}>
                      Batal
                    </Button>
                  </DialogClose>
                  <Button 
                    className="w-1/2 bg-[#e53e51] hover:bg-red-600 text-white"
                    onClick={handleFalsePositiveSubmit}
                    disabled={isFalsePositiveSubmitting || !falsePositiveReason.trim()}
                  >
                    {isFalsePositiveSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses</>
                    ) : (
                      `Tandai Bukan Kondisi ${status}`
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
