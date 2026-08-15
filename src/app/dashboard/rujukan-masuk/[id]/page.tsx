"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { mockReferrals } from "@/lib/mockPsychologistData";
import { Referral } from "@/types/api";
import { AlertTriangle, Sparkles, Book, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  
  const [referral, setReferral] = useState<Referral | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    // In a real app, fetch from API
    const fetchReferral = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const found = mockReferrals.find((r) => r.id === id);
      setReferral(found || null);
      setLoading(false);
    };
    fetchReferral();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (!referral) return <div className="p-8 text-center text-red-500">Data tidak ditemukan.</div>;

  const showConfirmButtons = referral.status === "Menunggu Konfirmasi";

  return (
    <div className="mx-auto space-y-6 pb-20">
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
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Sisa Waktu Respon</p>
            </div>
            {showConfirmButtons && !referral.is_expired && (
              <p className="text-red-500 font-bold text-lg">{referral.remaining_time}</p>
            )}
            {referral.is_expired && (
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
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 font-normal">
                  {referral.status}
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
                <Sparkles className="w-5 h-5 text-gray-800" />
                <h4 className="font-semibold text-gray-800">Ringkasan AI</h4>
              </div>
              <Badge variant="outline" className="text-gray-400 font-normal text-xs bg-gray-50">Read Only</Badge>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {referral.ai_summary || "Belum ada ringkasan AI untuk kasus ini."}
            </div>
          </div>

          {/* Tambah Catatan Klinis */}
          <div className="border rounded-lg p-5">
            <h4 className="font-semibold text-gray-800">Tambah Catatan Klinis</h4>
            <p className="text-sm text-gray-500 mb-4">Catatan Anda ditambahkan sebagai anotasi profesional, ringkasan AI tidak akan diubah.</p>
            <Textarea 
              placeholder="Tuliskan observasi, koreksi konteks, atau catatan profesional Anda terkait ringkasan AI ini..."
              className="min-h-[100px] bg-white resize-none"
            />
            <div className="flex justify-end mt-4">
              <Button className="bg-indigo-300 hover:bg-indigo-400 text-white min-w-[120px]">
                Simpan
              </Button>
            </div>
          </div>

          {/* Feedback Kualitas AI */}
          <div className="border rounded-lg p-5">
            <h4 className="font-semibold text-gray-800">Feedback Kualitas AI</h4>
            <p className="text-sm text-gray-500 mb-4">Bantu kami meningkatkan kualitas ringkasan AI berdasarkan pengalaman konseling Anda.</p>
            
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
              />
              <p className="text-xs text-gray-400 mt-2">Feedback ini tidak mengubah ringkasan secara langsung.</p>
            </div>

            <div className="flex justify-end mt-4">
              <Button className="bg-indigo-300 hover:bg-indigo-400 text-white min-w-[120px]">
                Kirim Feedback
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        {showConfirmButtons && (
          <div className="p-6 border-t flex flex-col gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white h-12 text-md" disabled={referral.is_expired}>
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
                    <p className="text-sm font-medium text-gray-800">Sabtu, 28 Agustus 2026</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Waktu</Label>
                    <p className="text-sm font-medium text-gray-800">10.00 WIB</p>
                  </div>
                </div>
                <DialogFooter className="flex gap-3 pt-2 sm:justify-between">
                  <Button variant="outline" className="flex-1" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}))}>
                    Batal
                  </Button>
                  <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white">
                    Ya, Konfirmasi
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-indigo-200 text-indigo-500 hover:bg-indigo-50 h-12 text-md" disabled={referral.is_expired}>
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
                  />
                </div>
                <DialogFooter className="flex gap-3 pt-2 sm:justify-between">
                  <Button variant="outline" className="flex-1 border-red-200 text-red-500 hover:bg-red-50" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}))}>
                    Batal
                  </Button>
                  <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                    Kirim Penolakan
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
