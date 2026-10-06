"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createSharing } from "@/lib/api";
import { useRouter } from "next/navigation";
import ShareResultModal from "./ShareResultModal";

export default function ShareThingCard() {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultZone, setResultZone] = useState<string | null>(null);
  const [resultContacts, setResultContacts] = useState<any[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!body.trim()) {
      toast.error("Isi cerita tidak boleh kosong");
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await createSharing({
        title: "", // Empty title as requested
        description: body.trim(),
      });
      
      if (result.success && result.data) {
        toast.success("Curhatan berhasil dikirim");
        setBody("");
        
        // Cek zona dari NLP response
        const zone = result.data.sharing?.nlp?.response?.zone_status || "Unknown";
        setResultZone(zone);
        if (result.data.contacts) {
          setResultContacts(result.data.contacts);
        }
      } else {
        // Coba deteksi jika ini adalah error yang berkaitan dengan layanan analisis (bukan validasi)
        if (result.message && (result.message.toLowerCase().includes("analisis") || result.message.toLowerCase().includes("nlp") || result.message.toLowerCase().includes("500"))) {
          toast.success("Curhatan berhasil dikirim. Analisis sedang diproses.");
          setBody("");
          setTimeout(() => router.push("/dashboard"), 1000);
        } else {
          toast.error(result.message || "Gagal mengirim curhatan");
        }
      }
    } catch (error: any) {
      console.error("Error creating sharing:", error);
      // Jika layanan NLP mengembalikan 500, data sebenarnya sudah tersimpan di database sebelum menembak NLP
      if (error?.message?.includes("status 50") || error?.status === 500 || error?.status === 504) {
        toast.success("Curhatan berhasil disimpan. Analisis akan menyusul.");
        setBody("");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        toast.error("Terjadi kesalahan saat mengirim curhatan");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardContent className="p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Ceritakan lebih lanjut
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Informasi ini akan membantu kami memberikan saran yang lebih tepat
        </p>
        <div className="flex justify-center mb-8">
          <Image
            src="/image/mascot-share.webp"
            alt="maskot"
            width={200}
            height={200}
            priority
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-center text-gray-800 mb-1">
              Ceritakan hal apa yang membuat mood–mu kurang baik hari ini.
            </h3>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Tulis ceritamu disini</label>
              <Textarea
                placeholder="Type your message here."
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-40"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !body.trim()}
            >
              {isLoading ? "Mengirim..." : "Kirim"}
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </form>
      </CardContent>
      {resultZone && (
        <ShareResultModal 
          isOpen={!!resultZone} 
          zoneStatus={resultZone} 
          contacts={resultContacts}
          onClose={() => setResultZone(null)} 
        />
      )}
    </Card>
  );
}
