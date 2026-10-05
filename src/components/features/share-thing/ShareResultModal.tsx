"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowRight, X, Phone, ArrowLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";

interface ShareResultModalProps {
  isOpen: boolean;
  zoneStatus: string;
  onClose: () => void;
}

export default function ShareResultModal({ isOpen, zoneStatus, onClose }: ShareResultModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(7);
  const [showContactHelp, setShowContactHelp] = useState(false);
  const { profileData } = useUserProfile();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !showContactHelp && (zoneStatus === "Red Zone" || zoneStatus === "Yellow Zone")) {
      setCountdown(7);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Handle timeout actions
            if (zoneStatus === "Red Zone") {
              setShowContactHelp(true);
            } else if (zoneStatus === "Yellow Zone") {
              router.push("/self-help");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, showContactHelp, zoneStatus, router]);

  const handleManualAction = () => {
    if (zoneStatus === "Red Zone") {
      setShowContactHelp(true);
    } else if (zoneStatus === "Yellow Zone") {
      router.push("/self-help");
    }
  };

  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  if (!isOpen) return null;

  if (showContactHelp) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogTitle asChild>
          <VisuallyHidden>Kontak Bantuan</VisuallyHidden>
        </DialogTitle>
        <DialogContent className="max-w-md p-6">
          <button 
            onClick={() => setShowContactHelp(false)}
            className="flex items-center gap-2 text-indigo-600 font-medium hover:underline mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Kontak Bantuan</h2>
          <p className="text-gray-500 mb-8">Pilih bantuan yang paling sesuai untukmu.</p>
          
          <div className="space-y-4">
            {/* Guru BK Card */}
            <div className="border border-gray-100 rounded-xl p-4 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                  <FaWhatsapp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    {profileData?.mentor ? "Guru BK Pendamping" : "Kontak Sekolah Umum"}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {profileData?.mentor ? profileData.mentor.name : (profileData?.school?.name || "Tim BK Sekolah")}
                  </div>
                </div>
              </div>
              {profileData?.mentor?.phone && (
                <Button 
                  className="w-full bg-[#00A84D] hover:bg-green-600 text-white font-medium"
                  onClick={() => window.open(`https://wa.me/${profileData.mentor.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                >
                  <FaWhatsapp className="w-4 h-4 mr-2" /> Kirim Pesan di WhatsApp
                </Button>
              )}
            </div>
            
            {/* Hotline Card */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Hotline Kemenkes</div>
                <div className="font-semibold text-gray-900 text-lg">
                  <a href="tel:119" className="hover:underline text-blue-600">119</a>
                </div>
                <div className="text-xs text-gray-500">Layanan Kementrian Kesehatan 24/7</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-3 text-center">
            <Button 
              variant="outline" 
              className="w-full border-gray-200 text-gray-900 font-bold"
              onClick={handleDashboardRedirect}
            >
              Saya Sudah Aman
            </Button>
            <p className="text-xs text-gray-400">Kamu bisa kembali ke aplikasi kapan saja.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogTitle asChild>
        <VisuallyHidden>Hasil Curhatan</VisuallyHidden>
      </DialogTitle>
      <DialogContent className="max-w-md p-6 sm:p-8 outline-none">
        <div className="flex flex-col items-center text-center">
          
          {/* Header icon and title */}
          <div className="flex items-center gap-2 mb-6">
            {zoneStatus === "Red Zone" && <AlertTriangle className="w-5 h-5 text-red-600 fill-red-100" />}
            {zoneStatus === "Yellow Zone" && <AlertTriangle className="w-5 h-5 text-orange-500" />}
            {zoneStatus === "Green Zone" && <CheckCircle className="w-5 h-5 text-white fill-green-600" />}
            
            <h2 className={`text-lg font-bold ${
              zoneStatus === "Red Zone" ? "text-red-600" : 
              zoneStatus === "Yellow Zone" ? "text-orange-500" : "text-green-600"
            }`}>
              {zoneStatus === "Red Zone" && "Kamu Memerlukan Perhatian Segera"}
              {zoneStatus === "Yellow Zone" && "Kami Melihat Kamu Sedang Mengalami Masa Sulit"}
              {zoneStatus === "Green Zone" && "Terima kasih sudah bercerita"}
            </h2>
          </div>
          
          {/* Emoji graphic */}
          <div className="text-6xl mb-6">
            {zoneStatus === "Red Zone" && "😟"}
            {zoneStatus === "Yellow Zone" && "😢"}
            {zoneStatus === "Green Zone" && "😊"}
          </div>
          
          {/* Content box */}
          <div className={`p-6 rounded-2xl mb-6 w-full ${
            zoneStatus === "Red Zone" ? "bg-red-50 text-red-600" : 
            zoneStatus === "Yellow Zone" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-700"
          }`}>
            {zoneStatus === "Red Zone" && (
              <>
                <p className="font-bold mb-4">Kami Peduli dengan Kondisimu</p>
                <p className="mb-4">Terima kasih telah mempercayai kami dengan menceritakan apa yang kamu rasakan.</p>
                <p className="mb-4">Kami mendeteksi bahwa isi curhatanmu menunjukkan tanda-tanda yang memerlukan perhatian segera.</p>
                <p>Kamu tidak sendirian. Bantuan tersedia, dan kami menganjurkanmu untuk segera menghubungi seseorang yang dapat mendukungmu.</p>
              </>
            )}
            
            {zoneStatus === "Yellow Zone" && (
              <>
                <p className="font-bold mb-4">Terima kasih sudah berbagi cerita.</p>
                <p className="mb-4">Kami melihat bahwa isi curhatanmu menunjukkan kamu mungkin sedang mengalami tekanan atau kesulitan emosional. Kamu tidak perlu menghadapinya sendirian.</p>
                <p>Jika kamu merasa membutuhkan dukungan lebih lanjut, kami menyediakan beberapa pilihan bantuan yang dapat kamu akses kapan saja.</p>
              </>
            )}
            
            {zoneStatus === "Green Zone" && (
              <>
                <p className="font-bold mb-4">Apakah Kamu Aman Sekarang ?</p>
                <p>Kami ingin memastikan kamu merasa cukup aman setelah menceritakan apa yang kamu alami.</p>
              </>
            )}
          </div>
          
          {/* Buttons */}
          {zoneStatus === "Red Zone" && (
            <Button 
              className="w-full bg-[#E53E3E] hover:bg-red-700 text-white flex items-center justify-center gap-2"
              onClick={handleManualAction}
            >
              Kamu akan diarahkan ke kontak bantuan dalam ({countdown})... <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          
          {zoneStatus === "Yellow Zone" && (
            <Button 
              className="w-full bg-[#F59E0B] hover:bg-orange-600 text-white flex items-center justify-center gap-2"
              onClick={handleManualAction}
            >
              Kamu akan diarahkan ke Self Help dalam ({countdown})... <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          
          {zoneStatus === "Green Zone" && (
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline"
                className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => setShowContactHelp(true)}
              >
                Saya Belum Merasa Aman <X className="w-4 h-4 ml-1" />
              </Button>
              <Button 
                className="flex-1 bg-[#10B981] hover:bg-green-600 text-white"
                onClick={handleDashboardRedirect}
              >
                Saya merasa aman <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
          
        </div>
      </DialogContent>
    </Dialog>
  );
}
