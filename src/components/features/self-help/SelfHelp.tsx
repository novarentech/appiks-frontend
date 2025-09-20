"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SelfHelpCard } from "./SelfHelpCard";

export function SelfHelp() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const selfHelpItems = [
    {
      title: "Jurnal Harian (Daily Journalling)",
      description: "Ungkapkan pikiran dan perasaanmu di ruang yang aman",
      category: "Journalling",
      imageSrc: "/image/journalling.webp",
      imageAlt: "Jurnal Harian",
      link: "/self-help/journalling",
    },
    {
      title: "Jurnal Rasa Syukur (Gratitude Journal)",
      description: "Lihat sisi positif & apresiasi dirimu tiap hari",
      category: "Emotional",
      imageSrc: "/image/gratitude.webp",
      imageAlt: "Gratitude Journal",
      link: "/self-help/gratitude",
    },
    {
      title: "Latihan Pernapasan (Breathing Exercise)",
      description: "Video panduan pernapasan untuk relaksasi",
      category: "Mindfulness",
      imageSrc: "/image/breathing.webp",
      imageAlt: "Latihan Pernapasan",
      link: "/self-help/breathing",
    },
    {
      title: "Pelukan Kupu-Kupu (Butterfly Hug)",
      description: "Pelukan sederhana yang menenangkan hati dan pikiran.",
      category: "Emotional",
      imageSrc: "/image/butterfly-hug.webp",
      imageAlt: "Butterfly Hug",
      link: "/self-help/butterfly-hug",
    },
    {
      title: "Teknik Grounding (Grounding Technique)",
      description: "Kembalikan fokus pada diri dan lingkungan sekitarmu.",
      category: "Mindfulness",
      imageSrc: "/image/grounding.webp",
      imageAlt: "Grounding Technique",
      link: "/self-help/grounding",
    },
    {
      title: "Relaksasi Sensori (Sensory Relaxation)",
      description: "Rasakan ketenangan melalui panca indera.",
      category: "Physical",
      imageSrc: "/image/sensory.webp",
      imageAlt: "Sensory Relaxation",
      link: "/self-help/sensory",
    },
    {
      title: "Aktivitas Fisik (Physical Activity)",
      description:
        "Tetap aktif dengan gerakan kecil yang menyehatkan tubuh dan pikiran.",
      category: "Physical",
      imageSrc: "/image/physical-activity.webp",
      imageAlt: "Physical Activity",
      link: "/self-help/physical-activity",
    },
    {
      title: "Afirmasi Diri (Self-Affirmation)",
      description:
        "Kata-kata positif untuk membangun semangat dan kepercayaan dirimu.",
      category: "Emotional",
      imageSrc: "/image/affirmation.webp",
      imageAlt: "Self-Affirmation",
      link: "/self-help/affirmation",
    },
  ];

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group"
          onClick={handleGoToDashboard}
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
          Ke Halaman Dashboard
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Self-Help Toolkit
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Rangkaian latihan mindfulness dan strategi pengembangan diri yang bisa
          kamu coba sendiri
        </p>
      </div>

      {/* Cards */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selfHelpItems.map((item, index) => (
          <SelfHelpCard
            key={index}
            title={item.title}
            description={item.description}
            category={item.category}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
}
