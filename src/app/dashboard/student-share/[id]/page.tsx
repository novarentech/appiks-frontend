"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getSharingDetail, markSharingFalsePositive, replySharing, createCounseling, acknowledgeSharing, createCounselingLog, createReferralCounseling, getUsersByType } from "@/lib/api";
import { Sharing, User } from "@/types/api";
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
import CurhatViewDialog from "@/components/dialogs/CurhatViewDialog";
import { toast } from "sonner";

export default function DetailCurhatanPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: session } = useSession();
  const { profileData } = useUserProfile();

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
  const [isStartHandlingSubmitting, setIsStartHandlingSubmitting] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleRoom, setScheduleRoom] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");
  const [isScheduleSubmitting, setIsScheduleSubmitting] = useState(false);

  const [isRecordCounselingOpen, setIsRecordCounselingOpen] = useState(false);
  const [counselingMethod, setCounselingMethod] = useState("");
  const [counselingNote, setCounselingNote] = useState("");
  const [resolutionStatus, setResolutionStatus] = useState("");
  const [isRecordSubmitting, setIsRecordSubmitting] = useState(false);
  const [isViewReplyOpen, setIsViewReplyOpen] = useState(false);

  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [referralPsychologistId, setReferralPsychologistId] = useState("");
  const [referralRoom, setReferralRoom] = useState("");
  const [referralReason, setReferralReason] = useState("");
  const [referralNotes, setReferralNotes] = useState("");
  const [isReferralSubmitting, setIsReferralSubmitting] = useState(false);
  const [psychologists, setPsychologists] = useState<User[]>([]);
  const [isLoadingPsychologists, setIsLoadingPsychologists] = useState(false);

  // Helper functions
  const mapPriorityToStatus = (priority: string) => {
    const p = priority?.toLowerCase() || "rendah";
    if (p === "tinggi" || p === "kritis") return "Kritis";
    if (p === "sedang" || p === "prioritas") return "Prioritas";
    return "Aman";
  };

  const getApiStatusBadgeVariant = (status: string) => {
    const s = status?.toLowerCase() || "belum ditinjau";
    switch (s) {
      case "belum ditinjau":
      case "belum ditanggapi":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "sedang ditangani":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "konseling dijadwalkan":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "diselesaikan":
        return "bg-green-50 text-green-700 border-green-200";
      case "jadwal ditolak siswa":
        return "bg-red-50 text-red-700 border-red-200";
      case "menunggu persetujuan siswa":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "menunggu persetujuan rujukan":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
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
  }, [id, router]);

  useEffect(() => {
    const fetchPsychologists = async () => {
      if (isReferralOpen && psychologists.length === 0) {
        setIsLoadingPsychologists(true);
        try {
          const res = await getUsersByType("psychologist");
          if (res.success && res.data) {
            setPsychologists(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch psychologists", error);
        } finally {
          setIsLoadingPsychologists(false);
        }
      }
    };
    
    fetchPsychologists();
  }, [isReferralOpen, psychologists.length]);

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
        toast.success("Status berhasil diubah.");
        setIsFalsePositiveOpen(false);
        setFalsePositiveReason("");
        window.location.reload();
      } else {
        toast.error(res.message || "Gagal mengubah status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsFalsePositiveSubmitting(false);
    }
  };

  const handleStartHandlingSubmit = async () => {
    try {
      setIsStartHandlingSubmitting(true);
      const res = await acknowledgeSharing(id);
      if (res.success) {
        toast.success("Berhasil memulai penanganan.");
        setIsHandling(true);
        setIsStartHandlingOpen(false);
        window.location.reload();
      } else {
        toast.error(res.message || "Gagal memulai penanganan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsStartHandlingSubmitting(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    
    try {
      setIsReplySubmitting(true);
      const res = await replySharing(id, replyText);
      if (res.success) {
        toast.success("Balasan berhasil dikirim.");
        setIsReplyOpen(false);
        setReplyText("");
        window.location.reload();
      } else {
        toast.error(res.message || "Gagal mengirim balasan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsReplySubmitting(false);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleDate || !scheduleTime || !scheduleRoom) return;
    
    try {
      setIsScheduleSubmitting(true);
      const formattedDate = format(scheduleDate, "yyyy-MM-dd");
      
      const res = await createCounseling({
        date: formattedDate,
        time: scheduleTime,
        student_id: data!.user_id,
        counselor_id: profileData?.id || Number(session?.user?.id) || 0,
        sharing_id: id,
        room: scheduleRoom,
        notes: scheduleNote
      });

      if (res.success) {
        toast.success("Jadwal konseling berhasil diajukan.");
        setIsScheduleOpen(false);
        window.location.reload();
      } else {
        toast.error(res.message || "Gagal mengajukan jadwal konseling.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsScheduleSubmitting(false);
    }
  };

  const handleRecordCounselingSubmit = async () => {
    if (!counselingMethod || !counselingNote || !resolutionStatus) return;
    
    try {
      setIsRecordSubmitting(true);
      
      const payload = {
        counseling_id: data?.counseling?.id || 0,
        session_mode: counselingMethod,
        clinical_notes: counselingNote,
        resolution_status: resolutionStatus
      };

      const res = await createCounselingLog(payload);

      if (res.success) {
        setIsRecordCounselingOpen(false);
        if (resolutionStatus === "Perlu Rujukan Professional") {
          toast.success("Hasil konseling berhasil dicatat! Silakan buat rujukan.");
          setIsReferralOpen(true);
        } else {
          toast.success("Hasil konseling berhasil dicatat!");
          window.location.reload();
        }
      } else {
        toast.error(res.message || "Gagal mencatat hasil konseling.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsRecordSubmitting(false);
    }
  };

  const handleReferralSubmit = async () => {
    if (!referralPsychologistId || !referralReason) return;
    
    try {
      setIsReferralSubmitting(true);
      
      const payload = {
        student_id: data!.user_id,
        sharing_id: id,

        notes: referralNotes,
        reason: referralReason,
        psychologist_id: Number(referralPsychologistId)
      };

      const res = await createReferralCounseling(payload);

      if (res.success) {
        setIsReferralOpen(false);
        toast.success("Rujukan berhasil diajukan!");
        window.location.reload();
      } else {
        toast.error(res.message || "Gagal mengajukan rujukan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsReferralSubmitting(false);
    }
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
  const apiStatus = data.status?.toLowerCase() || "belum ditinjau";
  const keywords: string[] = (data.nlp?.response?.matched_keywords || [])
    .map((k: any) => typeof k === 'string' ? k : k.stem || k.keyword);

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

        {/* Hasil Evaluasi (Bukan Urgent) */}
        {apiStatus === "bukan urgent" && (
          <div className="border rounded-lg mb-6">
            <div className="p-4 border-b font-semibold">Hasil Evaluasi</div>
            <div className="p-6 grid gap-6">
              <div>
                <div className="text-gray-500 text-sm mb-1">Status Resolusi</div>
                <div className="font-semibold text-sm text-gray-900">Bukan Kondisi {status === "Aman" ? "Urgent" : status}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Alasan</div>
                <div className="font-semibold text-sm text-gray-900 leading-relaxed">
                  {data.nlp?.reason || "-"}
                </div>
              </div>
            </div>
          </div>
        )}

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
              {keywords.length > 0 ? (
                keywords.map((kw, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-red-50 text-red-600 hover:bg-red-100 font-normal px-3 py-1"
                  >
                    {kw}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500 font-semibold">-</span>
              )}
            </div>
          </div>
        )}

        {/* Detail Pengajuan Konseling / Informasi Rujukan / Catatan Hasil Konseling */}
        {data.counseling && (
          apiStatus === "menunggu persetujuan rujukan" ? (
            <div className="border rounded-lg mb-8">
              <div className="bg-gray-50/50 p-4 border-b font-semibold">Informasi Rujukan</div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="text-gray-500 text-xs mb-1">Dikirim pada</div>
                  <div className="font-semibold text-sm">
                    {data.counseling.created_at 
                      ? format(new Date(data.counseling.created_at), "MM/dd/yyyy hh:mm a") 
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Psikolog Tujuan</div>
                  <div className="font-semibold text-sm">
                    {data.counseling.psychologist?.name || (data.counseling.psychologist_id ? `Psikolog ID: ${data.counseling.psychologist_id}` : "-")}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Alasan Rujukan</div>
                  <div className="font-semibold text-sm leading-relaxed">{data.counseling.reason || "-"}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Catatan Tambahan</div>
                  <div className="font-semibold text-sm leading-relaxed">{data.counseling.notes || "-"}</div>
                </div>
              </div>
            </div>
          ) : apiStatus === "diselesaikan" ? (
            <div className="border rounded-lg mb-8">
              <div className="bg-gray-50/50 p-4 border-b font-semibold">Catatan Hasil Konseling</div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Tanggal</div>
                    <div className="font-semibold text-sm">
                      {data.counseling.scheduled_at 
                        ? format(new Date(data.counseling.scheduled_at), "MM/dd/yyyy") 
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Waktu</div>
                    <div className="font-semibold text-sm">
                      {data.counseling.scheduled_at 
                        ? format(new Date(data.counseling.scheduled_at), "hh:mm a") 
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Ruangan</div>
                    <div className="font-semibold text-sm">{data.counseling.room || "-"}</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Metode Konseling</div>
                    <div className="font-semibold text-sm">{data.counseling.method || "-"}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Catatan</div>
                    <div className="font-semibold text-sm leading-relaxed">{data.counseling.clinical_notes || data.counseling.notes || "-"}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Status Resolusi Insiden</div>
                    <div className="font-semibold text-sm">{data.counseling.resolution || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg mb-8">
              <div className="bg-gray-50/50 p-4 border-b font-semibold">Detail Pengajuan Konseling</div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Tanggal</div>
                    <div className="font-semibold text-sm">
                      {data.counseling.scheduled_at 
                        ? format(new Date(data.counseling.scheduled_at), "MM/dd/yyyy") 
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Waktu</div>
                    <div className="font-semibold text-sm">
                      {data.counseling.scheduled_at 
                        ? format(new Date(data.counseling.scheduled_at), "hh:mm a") 
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Ruangan</div>
                    <div className="font-semibold text-sm">{data.counseling.room || "-"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Catatan Tambahan</div>
                  <div className="font-semibold text-sm leading-relaxed">{data.counseling.notes || "-"}</div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Actions */}
        {apiStatus !== "menunggu persetujuan siswa" && (
          <div className="flex flex-col space-y-3">
          {apiStatus === "sudah ditanggapi" && data.reply ? (
            <>
              <Button 
                variant="outline" 
                className="py-6 text-base font-semibold border-teal-600 text-teal-600 hover:bg-teal-50"
                onClick={() => setIsViewReplyOpen(true)}
              >
                Lihat Balasan
              </Button>
              <CurhatViewDialog 
                curhat={data} 
                isOpen={isViewReplyOpen} 
                onClose={() => setIsViewReplyOpen(false)} 
              />
            </>
          ) : status !== "Aman" && !isHandling && apiStatus !== "sedang ditangani" && apiStatus !== "jadwal ditolak siswa" && apiStatus !== "konseling dijadwalkan" && apiStatus !== "bukan urgent" && apiStatus !== "diselesaikan" ? (
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
                    onClick={handleStartHandlingSubmit}
                    disabled={isStartHandlingSubmitting}
                  >
                    {isStartHandlingSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Ya, Mulai Tangani
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : status !== "Aman" && apiStatus === "konseling dijadwalkan" ? (
            <Dialog open={isRecordCounselingOpen} onOpenChange={setIsRecordCounselingOpen}>
              <DialogTrigger asChild>
                <Button className={`${currentConfig.primaryBtn} py-6 text-base font-semibold`}>
                  Catat Hasil Konseling
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-2xl font-bold">Catat Hasil Konseling</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2 text-base">
                    Dokumentasikan hasil sesi konseling dan tentukan tindak lanjut kasus siswa.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 mt-2">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Metode Konseling <span className="text-red-500">*</span></Label>
                    <Select value={counselingMethod} onValueChange={setCounselingMethod}>
                      <SelectTrigger className="w-full mt-2 h-10">
                        <SelectValue placeholder="Pilih metode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tatap Muka">Tatap Muka</SelectItem>
                        <SelectItem value="Video Call">Video Call</SelectItem>
                        <SelectItem value="Chat">Chat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Catatan <span className="text-red-500">*</span></Label>
                    <Textarea 
                      placeholder="Tuliskan hasil observasi, kondisi emosional siswa, respons selama sesi, dan evaluasi Guru BK..." 
                      className="mt-2 h-32 resize-none"
                      value={counselingNote}
                      onChange={(e) => setCounselingNote(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Status Resolusi Insiden <span className="text-red-500">*</span></Label>
                    <Select value={resolutionStatus} onValueChange={setResolutionStatus}>
                      <SelectTrigger className="w-full mt-2 h-10">
                        <SelectValue placeholder="Pilih status resolusi insiden" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Perlu Rujukan Professional">Perlu Rujukan Professional</SelectItem>
                        {status === "Kritis" && (
                          <SelectItem value="Bukan Kondisi Kritis (Red Zone)">Bukan Kondisi Kritis (Red Zone)</SelectItem>
                        )}
                        {status === "Prioritas" && (
                          <SelectItem value="Bukan Kondisi Prioritas (Yellow Zone)">Bukan Kondisi Prioritas (Yellow Zone)</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {resolutionStatus === "Perlu Rujukan Professional" && (
                      <p className="text-xs text-blue-600 mt-2 italic">Anda akan diarahkan ke form pengajuan rujukan setelah data disimpan</p>
                    )}
                    {resolutionStatus === "Bukan Kondisi Kritis (Red Zone)" && (
                      <p className="text-xs text-green-600 mt-2 italic">Status zona merah (kritis) akan dicabut dari monitoring aktif</p>
                    )}
                    {resolutionStatus === "Bukan Kondisi Prioritas (Yellow Zone)" && (
                      <p className="text-xs text-green-600 mt-2 italic">Status zona kuning (prioritas) akan dicabut dari monitoring aktif</p>
                    )}
                  </div>
                </div>

                <DialogFooter className="mt-6 flex flex-row gap-3 sm:space-x-0">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-1/2 border-gray-300 hover:bg-gray-50 text-blue-600 font-semibold h-11">
                      Batal
                    </Button>
                  </DialogClose>
                  <Button 
                    className="w-1/2 bg-[#5b61e2] hover:bg-[#4b51d2] text-white font-semibold h-11"
                    onClick={handleRecordCounselingSubmit}
                    disabled={isRecordSubmitting || !counselingMethod || !counselingNote || !resolutionStatus}
                  >
                    {isRecordSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Simpan Hasil Konseling"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : status !== "Aman" && (apiStatus === "sedang ditangani" || isHandling || apiStatus === "jadwal ditolak siswa") ? (
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#5b61e2] hover:bg-[#4b51d2] text-white py-6 text-base font-semibold">
                  {apiStatus === "jadwal ditolak siswa" ? "Ajukan Jadwal Konseling Kembali" : "Ajukan Pertemuan Konseling"}
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
          ) : apiStatus !== "bukan urgent" && apiStatus !== "diselesaikan" ? (
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
          ) : null}


          {status !== "Aman" && !isHandling && apiStatus !== "jadwal ditolak siswa" && apiStatus !== "konseling dijadwalkan" && apiStatus !== "sedang ditangani" && (
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

          {/* Dialog Pengajuan Rujukan Psikolog */}
          <Dialog open={isReferralOpen} onOpenChange={setIsReferralOpen}>
            <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl">
              <DialogHeader className="mb-2">
                <DialogTitle className="text-2xl font-bold">Rujuk ke Psikolog</DialogTitle>
                <DialogDescription className="text-gray-600 mt-2 text-base">
                  Buat referral untuk siswa ini ke psikolog
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 mt-2">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Psikolog Tujuan <span className="text-red-500">*</span></Label>
                  <Select value={referralPsychologistId} onValueChange={setReferralPsychologistId}>
                    <SelectTrigger className="w-full mt-2 h-10">
                      <SelectValue placeholder={isLoadingPsychologists ? "Memuat data..." : "Pilih psikolog..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {psychologists.map((psychologist) => (
                        <SelectItem key={psychologist.id} value={psychologist.id?.toString() || ""}>
                          {psychologist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Alasan Rujukan <span className="text-red-500">*</span></Label>
                  <Textarea 
                    placeholder="Sebutkan alasan detail mengapa siswa dirujuk..." 
                    className="mt-2 h-20 resize-none w-full"
                    value={referralReason}
                    onChange={(e) => setReferralReason(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Catatan Tambahan (Opsional)</Label>
                  <Textarea 
                    placeholder="Tambahkan informasi lain bila ada..." 
                    className="mt-2 h-20 resize-none w-full"
                    value={referralNotes}
                    onChange={(e) => setReferralNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6 flex flex-row gap-3 sm:space-x-0">
                <DialogClose asChild>
                  <Button variant="outline" className="w-1/2 border-gray-300 hover:bg-gray-50 text-blue-600 font-semibold h-11" disabled={isReferralSubmitting}>
                    Batal
                  </Button>
                </DialogClose>
                <Button 
                  className="w-1/2 bg-[#5b61e2] hover:bg-[#4b51d2] text-white font-semibold h-11"
                  onClick={handleReferralSubmit}
                  disabled={isReferralSubmitting || !referralPsychologistId || !referralReason}
                >
                  {isReferralSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kirim Rujukan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        )}
      </div>
    </div>
  );
}
