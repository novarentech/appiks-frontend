import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useEffect, useState } from "react";

const themes = [
  {
    title: "Tekanan Akademik",
    desc: "Curhatkan tentang stres tugas, ujian, atau kebingungan memilih jurusan dan masa depan.",
    img: "/image/share-edu.webp",
  },
  {
    title: "Kesehatan Mental",
    desc: "Ceritakan perasaan cemas, sedih, atau cara kamu mengelola stres dan emosi.",
    img: "/image/share-mental.webp",
  },
  {
    title: "Masalah Keluarga",
    desc: "Bagikan cerita tentang hubungan dengan orang tua, saudara, atau dinamika keluarga.",
    img: "/image/share-family.webp",
  },
  {
    title: "Pengembangan Diri",
    desc: "Ceritakan tentang cita-cita, motivasi, dan hal-hal yang ingin kamu capai.",
    img: "/image/share-dev.webp",
  },
];

export default function ShareThingDialog() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle asChild>
        <VisuallyHidden>Tema Curhat yang Bisa Kamu Sampaikan</VisuallyHidden>
      </DialogTitle>
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
        {/* DialogTitle for accessibility */}
        <div className="p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            Tema Curhat yang Bisa Kamu Sampaikan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {themes.map((t) => (
              <div
                key={t.title}
                className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl flex flex-col items-center p-6 text-center"
              >
                <Image
                  src={t.img}
                  alt={t.title}
                  width={90}
                  height={90}
                  className="mb-3"
                />
                <div className="font-bold text-xl text-gray-700 mb-2">
                  {t.title}
                </div>
                <div className="text-gray-600 text-base">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
