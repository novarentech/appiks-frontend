"use client";

import { useEffect, useState } from "react";
import { User, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getCounselingConsent, submitReferralConsent } from "@/lib/api";
import { toast } from "sonner";

interface ManageConsentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  counselingId: number;
}

export function ManageConsentDialog({
  isOpen,
  onOpenChange,
  counselingId,
}: ManageConsentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentId, setConsentId] = useState<number | null>(null);
  const [psychologistInfo, setPsychologistInfo] = useState<{
    name: string;
    location: string;
  } | null>(null);
  const [grantedAt, setGrantedAt] = useState<string | null>(null);
  const [agreedItems, setAgreedItems] = useState({
    mood_history: false,
    sharing_history: false,
    assesment_logs: false,
  });

  useEffect(() => {
    if (isOpen && counselingId) {
      fetchConsentData();
    }
  }, [isOpen, counselingId]);

  const fetchConsentData = async () => {
    try {
      setLoading(true);
      const res = await getCounselingConsent(counselingId);
      if (res.success && res.data) {
        const { id, scopes, granted_at, counseling } = res.data;
        setConsentId(id);
        
        if (granted_at) {
          const dateObj = new Date(granted_at);
          setGrantedAt(
            dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }) +
              ", " +
              dateObj.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }) +
              " WIB"
          );
        }

        if (counseling?.psychologist) {
          setPsychologistInfo({
            name: counseling.psychologist.name,
            location: counseling.psychologist.psychologist_profile?.institution_name || "Platform Eksternal",
          });
        }

        setAgreedItems({
          mood_history: scopes.includes("mood_history"),
          sharing_history: scopes.includes("sharing_history"),
          assesment_logs: scopes.includes("assesment_logs"),
        });
      } else {
        toast.error("Gagal mengambil data persetujuan");
        onOpenChange(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (key: keyof typeof agreedItems) => {
    setAgreedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!consentId) return;
    try {
      setIsSubmitting(true);
      const scopes = Object.entries(agreedItems)
        .filter(([_, isChecked]) => isChecked)
        .map(([key]) => key);

      const res = await submitReferralConsent(consentId, true, scopes);
      if (res.success) {
        toast.success("Berhasil menyimpan pengaturan persetujuan");
        onOpenChange(false);
      } else {
        toast.error(res.message || "Gagal menyimpan persetujuan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">Kelola Persetujuan Data</DialogTitle>
          <DialogDescription className="text-base text-gray-500">
            Lihat dan kelola izin akses data yang telah Anda berikan.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Psychologist Card */}
            <div className="bg-[#F4F9FF] border border-[#D5E5FA] rounded-xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white mt-1">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-blue-600">
                    {psychologistInfo?.name || "Psikolog Eksternal"}
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Aktif
                  </span>
                </div>
                <p className="text-sm text-blue-400 mt-0.5">
                  {psychologistInfo?.location}
                </p>
                {grantedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Izin diberikan pada: {grantedAt}
                  </p>
                )}
              </div>
            </div>

            {/* Scopes Selection */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Data yang Dibagikan</h4>
              <div className="space-y-3">
                {/* Mood */}
                <div
                  className="border border-gray-200 rounded-xl p-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleItem("mood_history")}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      agreedItems.mood_history
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {agreedItems.mood_history && <Check className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">
                      Riwayat mood 30 hari terakhir
                    </h5>
                    {grantedAt && agreedItems.mood_history && (
                      <p className="text-sm text-gray-500 mt-1">
                        Diberikan pada: {grantedAt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sharing */}
                <div
                  className="border border-gray-200 rounded-xl p-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleItem("sharing_history")}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      agreedItems.sharing_history
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {agreedItems.sharing_history && <Check className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">
                      Kutipan teks curhat yang memicu Red Zone
                    </h5>
                    {grantedAt && agreedItems.sharing_history && (
                      <p className="text-sm text-gray-500 mt-1">
                        Diberikan pada: {grantedAt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Assessment */}
                <div
                  className="border border-gray-200 rounded-xl p-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleItem("assesment_logs")}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      agreedItems.assesment_logs
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {agreedItems.assesment_logs && <Check className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-[15px]">
                      Catatan asesmen Guru BK
                    </h5>
                    {grantedAt && agreedItems.assesment_logs && (
                      <p className="text-sm text-gray-500 mt-1">
                        Diberikan pada: {grantedAt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <Button
                className="w-full h-14 bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-semibold rounded-xl"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
