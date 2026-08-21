import { Referral } from "@/types/api";
import Link from "next/link";
import {
  User,
  Calendar,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { decideReferral } from "@/lib/api";
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
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Alasan penolakan harus diisi");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await decideReferral(referral.id, { action: "reject", reject_reason: rejectReason });
      if (response.success) {
        toast.success("Penolakan jadwal berhasil dikirim");
        setIsRejectOpen(false);
        if (onActionSuccess) {
          onActionSuccess();
        } else {
          window.location.reload();
        }
      } else {
        toast.error(response.message || "Gagal menolak jadwal");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menolak jadwal");
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
      case "Menunggu Konfirmasi":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      case "Terkonfirmasi":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "Selesai":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "Ditolak":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const showTimer = referral.status === "Menunggu Konfirmasi";

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
              className={`font-normal border-0 ${getPriorityColor(referral.priority)}`}
            >
              {referral.priority}
            </Badge>
            <Badge
              variant="secondary"
              className={`font-normal border-0 ${getStatusColor(referral.status)}`}
            >
              {referral.status}
            </Badge>
            {referral.is_expired && !showTimer && (
              <Badge
                variant="secondary"
                className="font-normal bg-gray-100 text-gray-600 border-0 hover:bg-gray-200"
              >
                <Clock className="w-3 h-3 mr-1" /> Kadaluarsa
              </Badge>
            )}
          </div>

          {showTimer && !referral.is_expired && (
            <div className="text-right mt-1">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
                Sisa Waktu Respon
              </p>
              <p className="text-red-500 font-semibold">
                {referral.remaining_time}
              </p>
            </div>
          )}

          {showTimer && referral.is_expired && (
            <div className="text-right mt-1">
              <Badge
                variant="secondary"
                className="font-normal bg-gray-100 text-gray-600 border-0"
              >
                <Clock className="w-3 h-3 mr-1" /> Kadaluarsa
              </Badge>
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
              {referral.status === "Menunggu Konfirmasi" && (
                <>
                  <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white min-w-[120px]"
                        disabled={referral.is_expired}
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

                  <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-indigo-200 text-indigo-500 hover:bg-indigo-50 min-w-[120px]"
                        disabled={referral.is_expired}
                      >
                        Tolak Jadwal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Tolak Jadwal Konsultasi</DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                          Berikan alasan mengapa jadwal ini tidak dapat diterima. Alasan akan diteruskan ke siswa dan Guru BK.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="my-2">
                        <Label className="text-sm font-medium text-red-600 mb-1 block">Alasan Penolakan*</Label>
                        <Textarea 
                          placeholder="Jelaskan alasan penolakan..."
                          className="min-h-[100px]"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                      </div>
                      <DialogFooter className="flex gap-3 pt-2 sm:justify-between">
                        <Button variant="outline" className="flex-1 border-red-200 text-red-500 hover:bg-red-50" onClick={() => setIsRejectOpen(false)} disabled={isSubmitting}>
                          Batal
                        </Button>
                        <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={handleReject} disabled={isSubmitting}>
                          {isSubmitting ? "Memproses..." : "Kirim Penolakan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {referral.status === "Terkonfirmasi" && (
                <>
                  <Link href={`/dashboard/rujukan-masuk/${referral.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]">
                      Buka Laporan AI
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-500 hover:bg-indigo-50 min-w-[120px]"
                  >
                    Ubah Jadwal
                  </Button>
                </>
              )}

              {referral.status === "Selesai" && (
                <Link href={`/dashboard/rujukan-masuk/${referral.id}`}>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 min-w-[120px]"
                  >
                    Lihat Laporan
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <Link 
                href={`/dashboard/rujukan-masuk/${referral.id}`}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                Lihat Detail
              </Link>
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
    </Card>
  );
}
