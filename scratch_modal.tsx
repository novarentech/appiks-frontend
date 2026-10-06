"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowRight, Phone, CheckCheck, Info } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";

interface ShareResultModalProps {
  isOpen: boolean;
  zoneStatus: string;
  onClose: () => void;
  contacts?: any[];
}

const CircularProgress = ({ value, max, color }: { value: number, max: number, color: string }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  // Prevent division by zero
  const maxVal = max > 0 ? max : 1;
  const strokeDashoffset = circumference - (value / maxVal) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="transform -rotate-90 w-16 h-16" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
        <circle 
          cx="32" cy="32" r={radius} 
          stroke="currentColor" 
          strokeWidth="4" 
          fill="transparent" 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={color}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <span className={`absolute font-bold ${color}`}>{value}</span>
    </div>
  );
};

export default function ShareResultModal({ isOpen, zoneStatus, onClose, contacts }: ShareResultModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const { profileData } = useUserProfile();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      let initialTime = 0;
      if (zoneStatus === "Red Zone") initialTime = 30; // changed to 30 as requested but image says 25, we'll use 30 as user text said 30
      else if (zoneStatus === "Yellow Zone") initialTime = 15;
      else if (zoneStatus === "Green Zone") initialTime = 6;

      if (initialTime > 0) {
        setCountdown(initialTime);
        setMaxTime(initialTime);
        
        timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              if (zoneStatus === "Red Zone" || zoneStatus === "Green Zone") {
                router.push("/dashboard");
              } else if (zoneStatus === "Yellow Zone") {
                router.push("/self-help");
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, zoneStatus, router]);

  if (!isOpen) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogTitle asChild>
        <VisuallyHidden>Hasil Curhatan</VisuallyHidden>
      </DialogTitle>
      <DialogContent className={cn("p-8 outline-none", zoneStatus === "Red Zone" ? "max-w-2xl" : "max-w-md")}>
        <div className="flex flex-col">
          
          {zoneStatus === "Red Zone" && (
            <>
              <div className="flex items-center gap-2 mb-4 justify-center text-[#E53E3E]">
                <AlertTriangle className="w-6 h-6 fill-red-100" />
                <h2 className="text-xl font-bold">Kamu Memerlukan Perhatian Segera</h2>
              </div>
              <div className="text-6xl mb-6 text-center">🥲</div>
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-8 text-center">
                <p className="font-bold mb-2 text-base">Kami Peduli dengan Keselamatanmu</p>
                <p className="text-sm">Kamu tidak sendirian. Bantuan tersedia, pilih yang paling mudah dijangkau sekarang.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {contacts && contacts.length > 0 ? (
                  contacts.map((contact, index) => {
                    const isEmergency = contact.name.toLowerCase().includes("darurat") || contact.name.toLowerCase().includes("hotline") || contact.name.toLowerCase().includes("nasional");
                    const phoneStr = contact.phone || contact.number;
                    
                    if (isEmergency) {
                      return (
                        <div key={index} className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{contact.name}</div>
                              <div className="font-semibold text-gray-900 text-lg">{phoneStr || "119"}</div>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-[#E53E3E] hover:bg-red-700 text-white font-medium h-11"
                            onClick={() => window.open(`tel:${phoneStr || "119"}`)}
                          >
                            <Phone className="w-4 h-4 mr-2" /> Hubungi {phoneStr || "119"}
                          </Button>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                            <FaWhatsapp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                              {contact.name.toLowerCase().includes("sekolah") ? "Kontak Sekolah Umum" : "Guru BK Pendamping"}
                            </div>
                            <div className="font-semibold text-gray-900 text-lg">{contact.name}</div>
                          </div>
                        </div>
                        {phoneStr ? (
                          <Button 
                            className="w-full bg-[#00A84D] hover:bg-green-600 text-white font-medium h-11"
                            onClick={() => window.open(`https://wa.me/${phoneStr.replace(/[^0-9]/g, '')}`, '_blank')}
                          >
                            <FaWhatsapp className="w-4 h-4 mr-2" /> Kirim Pesan di WhatsApp
                          </Button>
                        ) : (
                          <div className="text-xs text-gray-500 h-11 flex items-center justify-center border border-dashed rounded-md">Nomor tidak tersedia</div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                          <FaWhatsapp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                            {profileData?.mentor ? "Guru BK Pendamping" : "Kontak Sekolah Umum"}
                          </div>
                          <div className="font-semibold text-gray-900 text-lg">
                            {profileData?.mentor ? profileData.mentor.name : (profileData?.school?.name || "Tim BK Sekolah")}
                          </div>
                        </div>
                      </div>
                      {profileData?.mentor?.phone && (
                        <Button 
                          className="w-full bg-[#00A84D] hover:bg-green-600 text-white font-medium h-11"
                          onClick={() => window.open(`https://wa.me/${profileData.mentor.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                        >
                          <FaWhatsapp className="w-4 h-4 mr-2" /> Kirim Pesan di WhatsApp
                        </Button>
                      )}
                    </div>
                    <div className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Hotline Kemenkes</div>
                          <div className="font-semibold text-gray-900 text-lg">119</div>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-[#E53E3E] hover:bg-red-700 text-white font-medium h-11"
                        onClick={() => window.open(`tel:119`)}
                      >
                        <Phone className="w-4 h-4 mr-2" /> Hubungi 119
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center">
                <CircularProgress value={countdown} max={maxTime} color="text-red-500" />
                <p className="text-sm text-gray-500 mt-4 mb-6">Kembali ke dashboard dalam {countdown} detik...</p>
                
                <Button 
                  variant="outline"
                  className="w-full max-w-md border-gray-200 text-gray-900 font-bold h-12 text-base"
                  onClick={() => router.push("/dashboard")}
                >
                  Saya Sudah Aman
                </Button>
                <p className="text-xs text-gray-400 mt-6 text-center">Menghubungi bantuan bersifat pribadi dan tidak akan langsung diketahui teman-temanmu.</p>
              </div>
            </>
          )}

          {zoneStatus === "Yellow Zone" && (
            <>
              <div className="flex items-center gap-2 mb-6 justify-center text-[#F59E0B]">
                <Info className="w-6 h-6" />
                <h2 className="text-xl font-bold">Kami Melihat Kamu Sedang Mengalami Masa Sulit</h2>
              </div>
              <div className="text-6xl mb-8 text-center">😢</div>
              <div className="bg-[#FFFBEB] text-[#D97706] p-8 rounded-2xl mb-10 text-center text-sm">
                <p className="font-bold mb-4 text-base">Terima kasih sudah berbagi cerita.</p>
                <p className="mb-4 leading-relaxed text-[15px]">Kami melihat bahwa isi curhatanmu menunjukkan kamu mungkin sedang mengalami tekanan atau kesulitan emosional. Kamu tidak perlu menghadapinya sendirian.</p>
                <p className="leading-relaxed text-[15px]">Jika kamu merasa membutuhkan dukungan lebih lanjut, kami menyediakan beberapa pilihan bantuan yang dapat kamu akses kapan saja.</p>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress value={countdown} max={maxTime} color="text-orange-500" />
                <p className="text-sm text-gray-500 mt-4 mb-6">Kamu akan diarahkan ke Self Help dalam {countdown} detik...</p>
                
                <Button 
                  className="w-full max-w-md bg-[#F59E0B] hover:bg-orange-600 text-white font-bold h-12 text-base"
                  onClick={() => router.push("/self-help")}
                >
                  Ke Self help <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </>
          )}

          {zoneStatus === "Green Zone" && (
            <>
              <div className="flex items-center gap-2 mb-6 justify-center text-[#10B981]">
                <CheckCircle className="w-6 h-6 fill-green-100" />
                <h2 className="text-xl font-bold">Terima kasih sudah bercerita</h2>
              </div>
              <div className="text-6xl mb-8 text-center">😊</div>
              <div className="bg-[#F0FDF4] text-[#15803D] p-8 rounded-2xl mb-10 text-center text-sm">
                <p className="font-bold mb-2 text-base">Pesan Terkirim</p>
                <p className="leading-relaxed text-[15px]">Curhatanmu sudah kami terima dengan aman. Guru BK akan membacanya dengan penuh perhatian</p>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress value={countdown} max={maxTime} color="text-green-600" />
                <p className="text-sm text-gray-500 mt-4 mb-6">Kamu akan diarahkan ke dashboard dalam {countdown}detik...</p>
                
                <Button 
                  className="w-full max-w-md bg-[#10B981] hover:bg-green-600 text-white font-bold h-12 text-base"
                  onClick={() => router.push("/dashboard")}
                >
                  Kembali ke Dasbor <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </>
          )}

          {zoneStatus === "Unknown" && (
            <>
              <div className="flex items-center gap-2 mb-6 justify-center text-[#5b61e2]">
                <CheckCheck className="w-6 h-6" />
                <h2 className="text-xl font-bold">Cerita kamu sudah tersimpan</h2>
              </div>
              <div className="text-6xl mb-8 text-center">😀</div>
              <div className="bg-[#F5F7FF] text-[#4F46E5] p-8 rounded-2xl mb-10 text-center text-sm">
                <p className="font-bold mb-2 text-base">Cerita Tersimpan</p>
                <p className="leading-relaxed text-[15px]">Terima kasih sudah mau bercerita. Ceritamu sudah tersimpan dengan aman . Guru BK akan membacanya sebentar lagi.</p>
              </div>
              <div className="flex flex-col items-center">
                <Button 
                  className="w-full max-w-md bg-[#5b61e2] hover:bg-[#4b51d2] text-white font-bold h-12 text-base mt-12"
                  onClick={() => router.push("/dashboard")}
                >
                  Kembali ke Dasbor <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
