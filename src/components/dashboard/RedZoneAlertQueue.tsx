"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authGet } from "@/lib/api";
import { Sharing } from "@/types/api";
import { AlertCircle, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft("00:00:00");
      return;
    }

    const calculateTimeLeft = () => {
      // Parse targetDate string assuming local time or parse properly
      // format is like "2026-10-05 17:32:25"
      const targetTime = new Date(targetDate.replace(/-/g, "/")).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        return "00:00:00";
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
}

export default function RedZoneAlertQueue() {
  const router = useRouter();
  const [queue, setQueue] = useState<Sharing[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await authGet("/sharing?priority=tinggi&status=Belum Ditinjau");
        if (response.success && response.data && Array.isArray(response.data)) {
           if (response.data.length > 0) {
             setQueue(response.data);
             setIsOpen(true);
           }
        }
      } catch (error) {
        console.error("Failed to fetch red zone alerts", error);
      }
    };
    fetchAlerts();
  }, []);

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsOpen(false);
      setQueue([]);
    }
  };

  const handleTinjau = () => {
    const currentItem = queue[currentIndex];
    setIsOpen(false);
    setQueue([]); // clear the rest of the queue
    router.push(`/dashboard/student-share/${currentItem.id}`);
  };

  if (!isOpen || queue.length === 0) return null;

  const currentItem = queue[currentIndex];
  
  // Truncate description for snippet
  const snippet = currentItem.description?.length > 80 
    ? currentItem.description.substring(0, 80) + "..." 
    : currentItem.description;

  const keywords = (currentItem.nlp?.response?.matched_keywords || []) as any[];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
       if (!open) handleNext();
    }}>
       <VisuallyHidden>
         <DialogTitle>Kasus Baru Terdeteksi</DialogTitle>
       </VisuallyHidden>
       <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl outline-none">
          
          <div className="flex flex-col mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-red-600 font-medium text-sm">Kasus Baru Terdeteksi</p>
                <h2 className="text-xl font-bold text-red-600">Red Zone Alert</h2>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 mb-2">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{currentItem.user?.name || "Tanpa Nama"}</h3>
              <Badge variant="outline" className="border-red-200 text-xs text-red-500 bg-red-50/50 hover:bg-red-50/50 font-normal px-2.5 py-0.5">
                Kritis
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">
              Kelas : {currentItem.user?.room?.name || "Belum diatur"}
            </p>
            
            <div className="border-l-2 border-gray-300 pl-4 py-1 mb-4 italic text-gray-700">
              {snippet}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="bg-red-50 text-red-500 hover:bg-red-100 font-normal border border-red-100 px-3 py-1"
                >
                  {kw.stem}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-4 flex items-center justify-between mb-4">
             <span className="text-red-600 font-semibold tracking-wide text-sm">BATAS TINDAK LANJUT</span>
             <span className="text-red-600 font-bold text-xl">
               <CountdownTimer targetDate={currentItem.cutdown_for_report} />
             </span>
          </div>

          <div className="flex flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-red-600 text-red-600 hover:bg-red-50 font-semibold h-12 text-base rounded-xl"
              onClick={handleNext}
            >
              Tutup
            </Button>
            <Button 
              className="flex-1 bg-[#E53E3E] hover:bg-red-700 text-white font-semibold h-12 text-base rounded-xl"
              onClick={handleTinjau}
            >
              Tinjau dan Tangani
            </Button>
          </div>
       </DialogContent>
    </Dialog>
  );
}
