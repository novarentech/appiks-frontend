import { Timer, Zap, ZoomIn } from "lucide-react";

const features = [
  {
    icon: <Timer className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Pantau Mood Harian",
    description:
      "Catat dan pantau perasaanmu setiap hari dengan mudah. Dapatkan insight tentang pola emosionalmu.",
  },
  {
    icon: <Zap className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Self Help",
    description:
      "Akses tips dan teknik mengelola emosi, latihan pernapasan, dan panduan anger management.",
  },
  {
    icon: <ZoomIn className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Lapor Masalah",
    description:
      "Laporkan masalah bullying atau kekerasan dengan aman dan mendapat dukungan yang tepat.",
  },
  {
    icon: <ZoomIn className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Konten Edukasi",
    description:
      "Pelajari tentang kesehatan mental, anti-bullying, dan toleransi melalui konten yang menarik.",
  },
  {
    icon: <ZoomIn className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Rekap Mood",
    description:
      "Lihat progress dan perkembangan mood mingguan/bulanan dalam bentuk grafik yang mudah dipahami.",
  },
  {
    icon: <ZoomIn className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Motivasi Harian",
    description:
      "Dapatkan kata-kata motivasi dan quote inspiratif setiap hari untuk menjaga semangat.",
  },
];

const Feature = () => {
  return (
    <section className="w-full bg-slate-200 py-24 sm:py-32 lg:py-40">
      <div className="container px-4 sm:px-8 lg:px-16 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-8 lg:text-5xl">
            Fitur Unggulan
          </h2>
          <p className="mb-4 text-sm sm:text-base text-muted-foreground max-w-xl">
            Platform komprehensif untuk mendukung kesehatan mental siswa dengan
            berbagai fitur yang mudah digunakan
          </p>
        </div>
        <div className="mt-10 sm:mt-14 lg:mt-20 grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="rounded-xl bg-accent p-6 flex flex-col md:flex-row gap-6 items-center md:items-start"
              aria-labelledby={`feature-title-${idx}`}
            >
              <span className="flex items-center justify-center rounded-full bg-background w-14 h-14 mb-4 md:mb-0">
                {feature.icon}
              </span>
              <div className="flex-1 text-center md:text-left">
                <h3
                  className="mb-2 text-lg sm:text-xl font-semibold"
                  id={`feature-title-${idx}`}
                >
                  {feature.title}
                </h3>
                <p className="leading-7 text-muted-foreground text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature };
