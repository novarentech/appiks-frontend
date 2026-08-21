"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User, CheckCircle2, AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { getCounselingList, submitReferralConsent, getCounselingConsent } from "@/lib/api";
import { ReferralNotification } from "@/types/notifications";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ConsentPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [referral, setReferral] = useState<ReferralNotification | null>(null);
  const [consentId, setConsentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [agreedItems, setAgreedItems] = useState({
    mood: false,
    text: false,
    notes: false
  });

  const toggleItem = (key: keyof typeof agreedItems) => {
    setAgreedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const isAnyAgreed = Object.values(agreedItems).some(Boolean);

  useEffect(() => {
    const fetchReferral = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [counselingResponse, consentResponse] = await Promise.all([
          getCounselingList("external"),
          getCounselingConsent(id)
        ]);
        
        if (consentResponse.success && consentResponse.data) {
          setConsentId(consentResponse.data.id);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!referral) return null;

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      
      if (!consentId) {
        toast.error("ID persetujuan tidak ditemukan");
        setIsSubmitting(false);
        return;
      }
      
      const scopes: string[] = [];
      if (agreedItems.mood) scopes.push("mood_history");
      if (agreedItems.text) scopes.push("sharing_history");
      if (agreedItems.notes) scopes.push("assesment_logs");
      
      const res = await submitReferralConsent(consentId, true, scopes);
      if (res.success) {
        setIsConfirmOpen(false);
        toast.success("Berhasil menyetujui rujukan");
        router.push(`/rujukan/${id}/consent/success`);
      } else {
        toast.error(res.message || "Gagal memproses persetujuan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Persetujuan Akses Data
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Untuk melanjutkan rujukan konseling, berikut data yang Anda izinkan untuk dibagikan kepada psikolog mitra.
          </p>
        </div>

        {/* Doctor Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">{referral.psychologist}</h3>
            <p className="text-sm text-blue-600">{referral.location}</p>
          </div>
        </div>

        {/* Data Sharing Info */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Data yang Akan Dibagikan
          </h2>
          <p className="text-sm text-gray-500">
            Dengan menyetujui consent ini, data di bawah akan dibagikan dan dapat diakses oleh psikolog untuk mendukung proses konseling.
          </p>
        </div>

        {/* List of Data */}
        <div className="space-y-3 mb-8">
          <div 
            className={`border rounded-xl p-4 flex gap-3 cursor-pointer transition-colors ${agreedItems.mood ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100'}`}
            onClick={() => toggleItem("mood")}
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${agreedItems.mood ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'}`}>
              {agreedItems.mood && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${agreedItems.mood ? 'text-indigo-900' : 'text-gray-900'}`}>Riwayat mood 30 hari terakhir</h4>
              <p className="text-xs text-gray-500 mt-1">Data aktivitas dan pola mood Anda dalam 30 hari terakhir</p>
            </div>
          </div>
          
          <div 
            className={`border rounded-xl p-4 flex gap-3 cursor-pointer transition-colors ${agreedItems.text ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100'}`}
            onClick={() => toggleItem("text")}
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${agreedItems.text ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'}`}>
              {agreedItems.text && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${agreedItems.text ? 'text-indigo-900' : 'text-gray-900'}`}>Kutipan teks curhat yang memicu Red Zone</h4>
              <p className="text-xs text-gray-500 mt-1">Teks curhat yang terdeteksi memerlukan perhatian khusus (disamarkan)</p>
            </div>
          </div>
          
          <div 
            className={`border rounded-xl p-4 flex gap-3 cursor-pointer transition-colors ${agreedItems.notes ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100'}`}
            onClick={() => toggleItem("notes")}
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${agreedItems.notes ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'}`}>
              {agreedItems.notes && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${agreedItems.notes ? 'text-indigo-900' : 'text-gray-900'}`}>Catatan asesmen Guru BK</h4>
              <p className="text-xs text-gray-500 mt-1">Catatan dan asesmen dari Guru BK sekolah</p>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            Data yang Anda bagikan akan digunakan untuk di berikan ke psikolog sebagai screening.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base font-semibold disabled:bg-indigo-300 disabled:cursor-not-allowed"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isSubmitting || !isAnyAgreed}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Saya Setuju & Lanjutkan
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[450px] p-6 rounded-2xl">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">Konfirmasi Persetujuan Data?</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-gray-600 mb-4 text-[15px] leading-relaxed">
              Anda akan membagikan data yang telah dipilih kepada psikolog untuk mendukung proses konseling.
            </p>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              Pastikan Anda telah membaca dan memahami data yang akan dibagikan.
            </p>
          </div>
          <DialogFooter className="flex flex-row gap-3 sm:gap-3 mt-6 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline" className="w-1/2 text-[#e53e51] border-gray-300 hover:bg-gray-50 h-11 text-base font-semibold" disabled={isSubmitting}>
                Batal
              </Button>
            </DialogClose>
            <Button
              className="w-1/2 bg-[#e53e51] hover:bg-red-600 text-white h-11 text-base font-semibold"
              onClick={handleApprove}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Ya, Saya Setuju
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
