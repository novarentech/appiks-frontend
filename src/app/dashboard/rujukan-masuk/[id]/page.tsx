"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { Referral, BackendReferralSummaryData } from "@/types/api";
import { decideReferral, getReferralSummary, submitReferralFeedback, getCounselingConsent, getReferralAvailableDates, getReferralAvailableSlots, getPsychologistReferralById, getPsychologistReferrals } from "@/lib/api";
import { AlertTriangle, Sparkles, Book, ThumbsUp, ThumbsDown, Lock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function RujukanMasukDetailPage() {
  return (
    <RoleGuard permissionType="rujukan-masuk">
      <RujukanMasukDetailContent />
    </RoleGuard>
  );
}

function RujukanMasukDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "menunggu":
        return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
      case "confirmed":
      case "dijadwalkan":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200";
      case "finished":
      case "selesai":
      case "diselesaikan":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case "rejected":
      case "ditolak":
        return "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200";
      case "expired":
        return "bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "Menunggu Konfirmasi";
      case "confirmed": return "Terkonfirmasi";
      case "finished":
      case "selesai":
      case "diselesaikan": return "Selesai";
      case "rejected":
      case "ditolak": return "Ditolak";
      case "expired": return "Expired";
      default: return status;
    }
  };
  
  const [referral, setReferral] = useState<Referral | null>(null);
  const [summary, setSummary] = useState<BackendReferralSummaryData | null>(null);
  const [consentScopes, setConsentScopes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [clinicalNotesInput, setClinicalNotesInput] = useState("");
  const [improvementFeedbackInput, setImprovementFeedbackInput] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmNotesOpen, setIsConfirmNotesOpen] = useState(false);
  
  // Reschedule states
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch AI Summary, Consent Data, Referral Detail, and Referral List concurrently
        const [summaryRes, consentRes, referralDetailRes, referralsListRes] = await Promise.all([
          getReferralSummary(id).catch(() => null),
          getCounselingConsent(Number(id)).catch(() => null),
          getPsychologistReferralById(id).catch(() => null),
          getPsychologistReferrals({ limit: 50 }).catch(() => null),
        ]);

        if (summaryRes?.success && summaryRes?.data) {
          setSummary(summaryRes.data);
        } else {
          setSummary(null);
        }
        
        if (consentRes?.success && consentRes?.data) {
          setConsentScopes(consentRes.data.scopes || []);
        }

        // Find referral from referralDetailRes or search within referralsListRes
        let rawReferralItem: any = null;
        if (referralDetailRes?.success && referralDetailRes?.data) {
          rawReferralItem = referralDetailRes.data;
        } else if (referralsListRes?.success && referralsListRes?.data?.data) {
          rawReferralItem = referralsListRes.data.data.find(
            (item: any) =>
              item.counseling_id?.toString() === id ||
              item.counseling?.id?.toString() === id ||
              item.id?.toString() === id
          );
        }

        const itemFromSummary = summaryRes?.success ? summaryRes.data : null;

        const referralId = rawReferralItem?.id?.toString() || id;
        const counselingId = rawReferralItem?.counseling_id?.toString() || rawReferralItem?.counseling?.id?.toString() || id;

        const studentName =
          rawReferralItem?.student?.name ||
          itemFromSummary?.student?.name ||
          "Tanpa Nama";

        const rawStatus = (
          rawReferralItem?.status ||
          (itemFromSummary as any)?.status ||
          itemFromSummary?.student?.status ||
          itemFromSummary?.sharing?.status ||
          "pending"
        ).toLowerCase();

        const rawPriority = (
          (rawReferralItem?.counseling as any)?.sharing?.priority ||
          itemFromSummary?.student?.priority ||
          itemFromSummary?.sharing?.priority ||
          ""
        ).toLowerCase();
        const priorityVal = ["sedang", "berat", "kritis", "tinggi"].includes(rawPriority) ? "Kritis" : "Prioritas";

        // Date and Time formatting
        let dateVal = "-";
        let timeVal = "-";
        const slot = rawReferralItem?.slot || (itemFromSummary as any)?.slot;
        if (slot?.slot_date) {
          dateVal = new Date(slot.slot_date).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
          });
        } else if (itemFromSummary?.student?.reported_at) {
          dateVal = new Date(itemFromSummary.student.reported_at).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
          });
        }

        if (slot?.slot_start_time) {
          timeVal = slot.slot_end_time
            ? `${slot.slot_start_time.slice(0, 5)} - ${slot.slot_end_time.slice(0, 5)} WIB`
            : `${slot.slot_start_time.slice(0, 5)} WIB`;
        } else if (itemFromSummary?.student?.reported_at) {
          timeVal = new Date(itemFromSummary.student.reported_at).toLocaleTimeString("id-ID", {
            hour: "2-digit", minute: "2-digit"
          }) + " WIB";
        }

        const referrerName =
          rawReferralItem?.counseling?.counselor?.name ||
          itemFromSummary?.student?.counselor_name ||
          "Guru BK";

        const counselorNotes =
          rawReferralItem?.counseling?.notes ||
          itemFromSummary?.raw_payload?.assesment_logs?.[0]?.clinical_notes ||
          "-";

        const submittedAtRaw =
          rawReferralItem?.created_at ||
          itemFromSummary?.student?.reported_at ||
          itemFromSummary?.sharing?.created_at ||
          itemFromSummary?.generated_at;
        const submittedAt = submittedAtRaw
          ? new Date(submittedAtRaw).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            })
          : "-";

        const nis =
          rawReferralItem?.student?.nis ||
          rawReferralItem?.student?.identifier ||
          itemFromSummary?.student?.nis ||
          "-";

        const className =
          rawReferralItem?.student?.class ||
          rawReferralItem?.student?.room?.name ||
          itemFromSummary?.student?.class ||
          "-";

        const studentStory =
          rawReferralItem?.counseling?.sharing?.description ||
          itemFromSummary?.sharing?.description ||
          undefined;

        const detectedKeywords =
          rawReferralItem?.counseling?.sharing?.nlp?.response?.matched_keywords?.map((k: any) => k.stem) ||
          itemFromSummary?.sharing?.nlp?.response?.matched_keywords?.map((k: any) => k.stem) ||
          undefined;

        const mappedReferral: Referral = {
          id: referralId,
          counseling_id: counselingId,
          student_name: studentName,
          priority: priorityVal,
          status: rawStatus,
          remaining_time: "-",
          date: dateVal,
          time: timeVal,
          referrer_name: referrerName,
          counselor_notes: counselorNotes,
          submitted_at: submittedAt,
          is_expired: false,
          nis: nis,
          class_name: className,
          student_story: studentStory,
          detected_keywords: detectedKeywords,
        };

        setReferral(mappedReferral);
      } catch (error) {
        console.error("Error fetching detail:", error);
        setReferral((prev) => prev || {
          id: id,
          counseling_id: id,
          student_name: "Siswa",
          priority: "Prioritas",
          status: "pending",
          remaining_time: "-",
          date: "-",
          time: "-",
          referrer_name: "Guru BK",
          counselor_notes: "-",
          submitted_at: "-",
          is_expired: false,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (isRescheduleOpen && referral) {
      const fetchDates = async () => {
        setIsLoadingDates(true);
        try {
          const res = await getReferralAvailableDates(Number(referral.counseling_id || id));
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
  }, [isRescheduleOpen, referral?.counseling_id, id]);

  if (loading || !referral) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  const showConfirmButtons = referral.status?.toLowerCase() === "pending";

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      const response = await decideReferral(referral.id, { action: "confirm" });
      if (response.success) {
        toast.success("Jadwal konseling berhasil dikonfirmasi");
        setIsConfirmOpen(false);
        // Lakukan refresh dengan mengganti router.push dengan window.location.href
        window.location.href = "/dashboard/rujukan-masuk";
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
        action: "reschedule",
        reschedule_reason: rescheduleReason,
        slot_id: Number(selectedSlot.slot_id || selectedSlot.id)
      });
      if (response.success) {
        toast.success("Pengajuan perubahan jadwal berhasil dikirim");
        setIsRescheduleOpen(false);
        window.location.href = "/dashboard/rujukan-masuk";
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

  const isSessionStarted = () => {
    if (!referral || !referral.date) return false;
    try {
      const now = new Date();
      let sessionDate = new Date();

      if (referral.date.includes("T")) {
        sessionDate = new Date(referral.date);
      } else {
        const parts = referral.date.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            sessionDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
          } else {
            sessionDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
      }

      if (referral.time) {
        const timeStartStr = referral.time.split(" ")[0]?.split("-")[0];
        if (timeStartStr && timeStartStr.includes(":")) {
          const [hours, minutes] = timeStartStr.split(":");
          sessionDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        }
      }
      return now >= sessionDate;
    } catch (e) {
      return true;
    }
  };

  const handleRatingSubmit = async () => {
    if (!feedback && !improvementFeedbackInput.trim()) {
      toast.error("Isi minimal salah satu form sebelum menyimpan");
      return;
    }

    try {
      setIsSubmittingFeedback(true);
      
      const payload: any = {};
      if (feedback) payload.rating = feedback === 'up' ? 'good' : 'bad';
      if (improvementFeedbackInput.trim()) payload.improvement_feedback = improvementFeedbackInput;

      const response = await submitReferralFeedback(id, payload);
      
      if (response.success) {
        toast.success("Feedback berhasil dikirim", {
          description: "Penilaian tidak memengaruhi rekam siswa",
        });
        const summaryRes = await getReferralSummary(id);
        if (summaryRes.success && summaryRes.data) {
          setSummary(summaryRes.data);
        }
      } else {
        toast.error(response.message || "Gagal menyimpan feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Terjadi kesalahan saat menyimpan feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleClinicalNotesSubmit = async () => {
    if (!clinicalNotesInput.trim()) return;

    try {
      setIsSubmittingFeedback(true);
      
      const payload: any = {
        clinical_notes: clinicalNotesInput
      };

      const response = await submitReferralFeedback(id, payload);
      
      if (response.success) {
        toast.success("Catatan berhasil dikirim kepada siswa");
        setIsConfirmNotesOpen(false);
        window.location.href = `/dashboard/rujukan-masuk/${id}`;
      } else {
        toast.error(response.message || "Gagal mengirim catatan");
      }
    } catch (error) {
      console.error("Error submitting notes:", error);
      toast.error("Terjadi kesalahan saat mengirim catatan");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  let parsedSummary = null;
  if (summary?.summary_text) {
    try {
      parsedSummary = JSON.parse(summary.summary_text);
    } catch (e) {
      console.warn("Summary text is not valid JSON, it will be rendered as plain text.");
      parsedSummary = null;
    }
  }

  // Check if status is finished / completed / selesai / diselesaikan
  const isFinished = [
    "finished",
    "selesai",
    "diselesaikan",
  ].includes(referral.status?.toLowerCase() || "") || [
    "finished",
    "selesai",
    "diselesaikan",
  ].includes(((summary as any)?.status || "").toLowerCase());

  // Calculate dynamic countdown
  let dynamicRemainingTimeStr = "-";
  const dynamicIsExpired = referral.status?.toLowerCase() === "expired";
  
  const deadlineStr = summary?.student?.deadline_at || summary?.deadline_at || summary?.sharing?.deadline_at;
  
  if (deadlineStr && !dynamicIsExpired && !isFinished) {
    const deadline = new Date(deadlineStr);
    const diffMs = deadline.getTime() - currentTime.getTime();
    
    if (diffMs > 0) {
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
      
      if (diffDays > 0) {
        dynamicRemainingTimeStr = `${diffDays} hari ${diffHours} jam`;
      } else {
        dynamicRemainingTimeStr = `${diffHours} jam ${diffMinutes} menit`;
      }
    }
  }

  return (
    <div className=" space-y-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Laporan AI & Catatan Klinis</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan kasus dan anotasi klinis profesional</p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Laporan {referral.student_name}</h2>
            <p className="text-gray-500 text-sm mt-1">Kasus ini memerlukan penanganan dan tindak lanjut segera.</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 font-normal">
                {referral.priority}
              </Badge>
              {!isFinished && dynamicRemainingTimeStr !== "-" && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Sisa Waktu Respon</p>
              )}
            </div>
            {!isFinished && dynamicRemainingTimeStr !== "-" && !dynamicIsExpired && (
              <p className="text-red-500 font-bold text-lg">{dynamicRemainingTimeStr}</p>
            )}
            {!isFinished && dynamicIsExpired && (
              <p className="text-gray-500 font-bold">Kadaluarsa</p>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Identitas Siswa Box */}
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Identitas Siswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                <p className="font-medium text-sm">{referral.student_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">NIS</p>
                <p className="font-medium text-sm">{referral.nis || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Kelas</p>
                <p className="font-medium text-sm">{referral.class_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Guru BK PIC</p>
                <p className="font-medium text-sm">{referral.referrer_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal Laporan</p>
                <p className="font-medium text-sm">{referral.date} {referral.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <Badge className={`${getStatusColor(referral.status)} border-0 font-normal`}>
                  {getStatusText(referral.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Alert Klinis */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-800 font-medium text-sm">Perhatian Klinis</h4>
              <p className="text-yellow-700 text-sm mt-0.5">
                Ringkasan ini dihasilkan AI dan tidak menggantikan asesmen klinis Anda. Gunakan sebagai konteks awal, bukan sebagai diagnosis.
              </p>
            </div>
          </div>

          {/* Accordion Catatan Siswa */}
          <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-gray-50 data-[state=open]:bg-gray-50">
                <div className="flex items-start gap-3 text-left">
                  <Book className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Catatan Siswa</h4>
                    <p className="text-xs text-gray-500 font-normal">Klik untuk membuka / menutup detail</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Curhatan Siswa :</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 italic text-sm text-gray-700">
                      "{referral.student_story || "Tidak ada data."}"
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Kata Kunci terdeteksi :</p>
                    <div className="flex gap-2">
                      {referral.detected_keywords?.map((kw) => (
                        <Badge key={kw} variant="secondary" className="bg-red-50 text-red-500 font-normal border-red-100">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Catatan Awal Guru BK :</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700">
                      {referral.counselor_notes}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Ringkasan AI */}
          <div className="border rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-800">Ringkasan AI</h4>
              </div>
              <div className="flex items-center gap-2">
                {summary?.llm_provider && (
                  <Badge variant="outline" className="text-gray-500 font-normal text-xs bg-gray-50 border-gray-200">
                    {summary.llm_provider}
                  </Badge>
                )}
                <Badge variant="outline" className="text-gray-400 font-normal text-xs bg-gray-50">Read Only</Badge>
              </div>
            </div>
            
            {parsedSummary ? (
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed grid gap-4">
                {parsedSummary.chief_complaint && (
                  <div>
                    <span className="font-semibold text-indigo-900 block mb-1">Keluhan Utama</span>
                    <p>{parsedSummary.chief_complaint}</p>
                  </div>
                )}
                {parsedSummary.assessment && (
                  <div>
                    <span className="font-semibold text-indigo-900 block mb-1">Asesmen</span>
                    <p>{parsedSummary.assessment}</p>
                  </div>
                )}
                {parsedSummary.plan && (
                  <div>
                    <span className="font-semibold text-indigo-900 block mb-1">Rencana (Plan)</span>
                    <p>{parsedSummary.plan}</p>
                  </div>
                )}
                {parsedSummary.resolution && (
                  <div>
                    <span className="font-semibold text-indigo-900 block mb-1">Resolusi</span>
                    <p>{parsedSummary.resolution}</p>
                  </div>
                )}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-200 mt-2">
                  {parsedSummary.session_count && (
                    <div className="text-xs text-gray-500">
                      Rekomendasi Sesi: <span className="font-medium text-gray-700">{parsedSummary.session_count}x</span>
                    </div>
                  )}
                  {parsedSummary.psychologist && (
                    <div className="text-xs text-gray-500">
                      Psikolog: <span className="font-medium text-gray-700">{parsedSummary.psychologist}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {(summary?.summary_text && summary.summary_text !== "null" && summary.summary_text.trim() !== "")
                  ? summary.summary_text
                  : (referral?.ai_summary || "Ringkasan AI belum tersedia.")}
              </div>
            )}
          </div>

          {/* Persetujuan Privasi Siswa */}
          <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-white">
            <h4 className="font-semibold text-gray-900 text-lg mb-1">Persetujuan Privasi Siswa</h4>
            <p className="text-sm text-gray-500 mb-6">
              Data berikut dibagikan atas persetujuan siswa untuk mendukung evaluasi klinis.
            </p>

            <div className="space-y-4">
              {consentScopes.includes("mood_history") ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-[#F9FAFB] rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-green-500 shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-[15px]">Riwayat mood 30 hari terakhir</h5>
                      <p className="text-[13px] text-gray-500 mt-0.5">Data aktivitas dan pola mood Anda dalam 30 hari terakhir</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/rujukan-masuk/${id}/mood`} className="ml-8 sm:ml-0 self-start sm:self-auto shrink-0">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 font-medium h-auto text-[14px]">Lihat Detail</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-[#F9FAFB] rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-[15px]">Riwayat mood 30 hari terakhir</h5>
                      <p className="text-[13px] text-gray-500 mt-0.5">Data aktivitas dan pola mood Anda dalam 30 hari terakhir</p>
                    </div>
                  </div>
                  <div className="ml-8 sm:ml-0 self-start sm:self-auto shrink-0">
                    <Badge variant="secondary" className="bg-gray-200/60 text-gray-600 hover:bg-gray-200/60 font-medium border-0 rounded-full px-4">Persetujuan Dicabut</Badge>
                  </div>
                </div>
              )}

              {consentScopes.includes("sharing_history") ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-[#F9FAFB] rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-green-500 shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-[15px]">Kutipan curhat 30 hari terakhir</h5>
                      <p className="text-[13px] text-gray-500 mt-0.5">Teks curhat siswa dalam 30 hari terakhir</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/rujukan-masuk/${id}/sharing`} className="ml-8 sm:ml-0 self-start sm:self-auto shrink-0">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 font-medium h-auto text-[14px]">Lihat Detail</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-[#F9FAFB] rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-[15px]">Kutipan curhat 30 hari terakhir</h5>
                      <p className="text-[13px] text-gray-500 mt-0.5">Teks curhat siswa dalam 30 hari terakhir</p>
                    </div>
                  </div>
                  <div className="ml-8 sm:ml-0 self-start sm:self-auto shrink-0">
                    <Badge variant="secondary" className="bg-gray-200/60 text-gray-600 hover:bg-gray-200/60 font-medium border-0 rounded-full px-4">Persetujuan Dicabut</Badge>
                  </div>
                </div>
              )}

              {consentScopes.includes("assesment_logs") ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-[#F9FAFB] rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-green-500 shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-[15px]">Catatan asesmen Guru BK</h5>
                      <p className="text-[13px] text-gray-500 mt-0.5">Catatan dan asesmen dari Guru BK sekolah</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/rujukan-masuk/${id}/assessment`} className="ml-8 sm:ml-0 self-start sm:self-auto shrink-0">
                    <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 font-medium h-auto text-[14px]">Lihat Detail</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 bg-[#F9FAFB] rounded-xl gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-[15px]">Catatan asesmen Guru BK</h5>
                      <p className="text-[13px] text-gray-500 mt-0.5">Catatan dan asesmen dari Guru BK sekolah</p>
                    </div>
                  </div>
                  <div className="ml-8 sm:ml-0 self-start sm:self-auto shrink-0">
                    <Badge variant="secondary" className="bg-gray-200/60 text-gray-600 hover:bg-gray-200/60 font-medium border-0 rounded-full px-4">Persetujuan Dicabut</Badge>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 text-[13px]">
              <span className="font-semibold text-red-500">Catatan:</span>{" "}
              <span className="text-red-500">
                Pencabutan persetujuan merupakan hak siswa. Untuk tindak lanjut, silakan koordinasikan dengan Guru BK.
              </span>
            </div>
          </div>

          {/* Tambah Catatan Klinis */}
          <div className="border rounded-lg p-5">
            <h4 className="font-semibold text-gray-800">
              {summary?.clinical_notes ? "Catatan untuk Siswa (Arahan Pasca Sesi)" : "Catatan untuk Siswa (Arahan Pasca Sesi)"}
            </h4>
            {summary?.clinical_notes ? (
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed mt-4">
                {summary.clinical_notes}
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4 mt-1">Catatan ini akan dikirim kepada siswa sebagai arahan setelah sesi.</p>
                <Textarea 
                  placeholder="Tuliskan pesan, arahan, atau tindak lanjut untuk siswa..."
                  className="min-h-[100px] bg-white resize-none"
                  value={clinicalNotesInput}
                  onChange={(e) => setClinicalNotesInput(e.target.value)}
                  disabled={isSubmittingFeedback}
                />
                <div className="flex justify-end mt-4">
                  <Dialog open={isConfirmNotesOpen} onOpenChange={setIsConfirmNotesOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                        disabled={!clinicalNotesInput.trim() || !isSessionStarted()}
                      >
                        Selesaikan Sesi & Kirim Catatan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Kirim Catatan kepada Siswa</DialogTitle>
                        <DialogDescription>
                          Anda akan mengakhiri sesi ini dan mengirimkan catatan berikut kepada siswa.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {clinicalNotesInput}
                      </div>
                      <DialogFooter className="flex gap-3 pt-4 sm:justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsConfirmNotesOpen(false)}
                          disabled={isSubmittingFeedback}
                          className="flex-1"
                        >
                          Batal
                        </Button>
                        <Button
                          type="button"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
                          onClick={handleClinicalNotesSubmit}
                          disabled={isSubmittingFeedback}
                        >
                          {isSubmittingFeedback ? "Mengirim..." : "Ya, Kirim Catatan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </div>

          {/* Feedback Kualitas AI (Hanya jika ringkasan AI tersedia) */}
          {summary?.summary_text && summary.summary_text !== "null" && summary.summary_text.trim() !== "" && (
            <div className="border rounded-lg p-5">
              <h4 className="font-semibold text-gray-800">Feedback Kualitas AI</h4>
              {summary?.rating || summary?.improvement_feedback ? (
                <div className="mt-4 space-y-4">
                  {summary.rating && (
                    <div>
                      <p className="text-sm font-medium mb-2">Penilaian Ringkasan AI</p>
                      <Badge variant="outline" className={`py-1 px-3 ${summary.rating === 'good' ? 'border-green-500 text-green-600 bg-green-50' : 'border-red-500 text-red-600 bg-red-50'}`}>
                        {summary.rating === 'good' ? (
                          <div className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> Membantu</div>
                        ) : (
                          <div className="flex items-center gap-1.5"><ThumbsDown className="w-3.5 h-3.5" /> Kurang Akurat</div>
                        )}
                      </Badge>
                    </div>
                  )}
                  {summary.improvement_feedback && (
                    <div>
                      <p className="text-sm font-medium mb-2">Masukan untuk Perbaikan</p>
                      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                        {summary.improvement_feedback}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4 mt-1">Bantu kami meningkatkan kualitas ringkasan AI berdasarkan pengalaman konseling Anda.</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Penilaian Ringkasan AI</p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className={`flex gap-2 ${feedback === 'up' ? 'border-green-500 text-green-600 bg-green-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                        onClick={() => setFeedback('up')}
                      >
                        Membantu <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className={`flex gap-2 ${feedback === 'down' ? 'border-red-500 text-red-600 bg-red-50' : 'text-red-600 border-red-200 hover:bg-red-50'}`}
                        onClick={() => setFeedback('down')}
                      >
                        Kurang Akurat <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Masukan untuk Perbaikan Ringkasan (opsional)</p>
                    <Textarea 
                      placeholder="Jelaskan konteks yang kurang tepat atau saran peningkatan AI..."
                      className="min-h-[80px] bg-white resize-none"
                      value={improvementFeedbackInput}
                      onChange={(e) => setImprovementFeedbackInput(e.target.value)}
                      disabled={isSubmittingFeedback}
                    />
                    <p className="text-xs text-gray-400 mt-2">Feedback ini tidak mengubah ringkasan secara langsung. Penilaian tidak memengaruhi rekam siswa.</p>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                      onClick={handleRatingSubmit}
                      disabled={isSubmittingFeedback || !feedback}
                    >
                      {isSubmittingFeedback ? "Memproses..." : "Kirim Feedback"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        {showConfirmButtons && (
          <div className="p-6 border-t flex flex-col gap-3">
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white h-12 text-md" disabled={dynamicIsExpired}>
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
                    <p className="text-sm font-medium text-gray-800">{referral?.date || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Waktu</Label>
                    <p className="text-sm font-medium text-gray-800">{referral?.time || "-"}</p>
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

            <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-indigo-200 text-indigo-500 hover:bg-indigo-50 h-12 text-md" disabled={dynamicIsExpired}>
                  Ubah Jadwal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajukan Perubahan Jadwal</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2">
                    Pilih jadwal pengganti dari slot waktu yang telah Anda sediakan. Siswa dan Guru BK akan menerima notifikasi mengenai perubahan jadwal.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-2 space-y-4">
                  {/* Select Date */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Tanggal Pengganti</Label>
                    {isLoadingDates ? (
                      <div className="h-10 border rounded-md flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                        Memuat daftar tanggal...
                      </div>
                    ) : (
                      <Select value={selectedDate} onValueChange={handleDateSelect}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Tanggal Baru" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDates && availableDates.length > 0 ? (
                            availableDates.map((date) => (
                              <SelectItem key={date.date} value={date.date}>
                                {date.formatted_date}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Tidak ada tanggal tersedia
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Select Slot */}
                  {selectedDate && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Waktu Pengganti</Label>
                      {isLoadingSlots ? (
                        <div className="h-10 border rounded-md flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                          Memuat daftar waktu...
                        </div>
                      ) : (
                        <Select
                          value={selectedSlot ? selectedSlot.slot_id?.toString() || selectedSlot.id?.toString() : ""}
                          onValueChange={(val: string) => {
                            const slot = availableSlots.find((s: any) => (s.slot_id?.toString() || s.id?.toString()) === val);
                            setSelectedSlot(slot || null);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Waktu Baru" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSlots && availableSlots.length > 0 ? (
                              availableSlots.map((slot: any) => (
                                <SelectItem key={slot.slot_id || slot.id} value={slot.slot_id?.toString() || slot.id?.toString()}>
                                  {slot.start_time || slot.slot_start_time} - {slot.end_time || slot.slot_end_time}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                Tidak ada waktu tersedia
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}

                  {/* Reason Textarea */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 block">Alasan Perubahan Jadwal*</Label>
                    <Textarea
                      placeholder="Jelaskan alasan mengapa jadwal perlu diubah..."
                      className="min-h-[80px] resize-none"
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter className="flex gap-3 pt-2 sm:justify-between">
                  <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-100" onClick={() => setIsRescheduleOpen(false)} disabled={isSubmitting}>
                    Batal
                  </Button>
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleReschedule} disabled={isSubmitting || !selectedSlot}>
                    {isSubmitting ? "Memproses..." : "Ajukan Jadwal Baru"}
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
