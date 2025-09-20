"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface WalkthroughSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export function SurveyWalkthrough() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [surveyType, setSurveyType] = useState<"secure" | "insecure">("secure");

  // Get survey type from sessionStorage based on isSafe value
  useEffect(() => {
    try {
      const isSafeStr = sessionStorage.getItem("mood_is_safe");
      if (isSafeStr !== null) {
        const isSafe = JSON.parse(isSafeStr);
        setSurveyType(isSafe ? "secure" : "insecure");
      }
    } catch (error) {
      console.error("Failed to parse isSafe from sessionStorage:", error);
      // Default to secure if parsing fails
      setSurveyType("secure");
    }
  }, []);

  const secureSlides: WalkthroughSlide[] = [
    {
      title: "SIAP MENJELAJAH ?",
      subtitle: "Hai, Navigator!",
      description:
        "Selamat datang di petualangan mengenal dirimu! Bersiaplah untuk menjelajahi kepribadian dan minatmu melalui serangkaian pertanyaan yang menyenangkan.",
      image: "/icon/ico-walk-1.webp",
    },
    {
      title: "MARI EKSPLORASI",
      subtitle: "Kompas Nilaimu",
      description:
        "Mari temukan nilai-nilai yang paling penting bagimu. Seperti kompas yang menunjukkan arah, nilai-nilaimu akan memandu setiap langkah perjalanan hidupmu.",
      image: "/icon/ico-walk-2.webp",
    },
    {
      title: "MARI EKSPLORASI",
      subtitle: "Peralatan Andalanmu",
      description:
        "Setiap petualang memiliki peralatan khusus yang diandalkan. Kita akan mengidentifikasi keterampilan dan bakat unik yang menjadi kekuatan terbesarmu.",
      image: "/icon/ico-walk-3.webp",
    },
    {
      title: "MARI EKSPLORASI",
      subtitle: "Medan Petualangan Ideal",
      description:
        "Tidak semua medan cocok untuk setiap petualang. Mari kita cari tahu lingkungan dan situasi kerja yang paling sesuai dengan kepribadianmu.",
      image: "/icon/ico-walk-4.webp",
    },
    {
      title: "MARI EKSPLORASI",
      subtitle: "Mulai Sekarang !",
      description:
        "Perjalanan seru mengenal dirimu sudah siap dimulai! Jawablah setiap pertanyaan dengan jujur untuk mendapatkan hasil yang akurat dan bermakna.",
      image: "/icon/ico-walk-5.webp",
    },
  ];

  const insecureSlides: WalkthroughSlide[] = [
    {
      title: "SIAP BERPETUALANG ?",
      subtitle: "Halo, Petualang!",
      description:
        "Terima kasih telah mempercayai kami. Mari kita mulai percakapan yang aman dan mendukung untuk membantu memahami perasaanmu saat ini.",
      image: "/icon/ico-walk-1.webp",
    },
    {
      title: "MARI EKSPLORASI",
      subtitle: "Kekuatan Supermu",
      description:
        "Setiap orang memiliki kekuatan unik yang membuatnya istimewa. Mari kita temukan talenta dan kemampuan luar biasa yang ada dalam dirimu.",
      image: "/icon/ico-walk-6.webp",
    },
    {
      title: "MARI EKSPLORASI",
      subtitle: "Mode Belajarmu",
      description:
        "Tidak ada cara belajar yang salah! Mari kita identifikasi gaya belajar yang paling cocok untukmu agar proses mengenal diri menjadi lebih efektif.",
      image: "/icon/ico-walk-7.webp",
    },
    {
      title: "MARI EKSPLORASI",
      subtitle: "Bahan Bakar Motivasi",
      description:
        "Setiap petualang membutuhkan energi untuk melanjutkan perjalanan. Kita akan menemukan hal-hal yang paling memotivasi dan menginspirasimu.",
      image: "/icon/ico-walk-8.webp",
    },
    {
      title: "MARI MULAI",
      subtitle: "Mulai Sekarang !",
      description:
        "Tidak ada jawaban benar atau salah. Jawablah dengan jujur sesuai dengan dirimu yang sesungguhnya. Selamat berpetualang!",
      image: "/icon/ico-walk-5.webp",
    },
  ];

  const slides: WalkthroughSlide[] =
    surveyType === "secure" ? secureSlides : insecureSlides;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Navigate to actual survey when reaching the end
      router.push("/survey");
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDotNavigation = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Walkthrough Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-2xl lg:max-w-4xl mx-auto min-h-[500px]">
        {/* Header */}
        <div className="bg-indigo-400 text-white text-center py-6">
          <h2 className="text-2xl font-bold">{slides[currentSlide].title}</h2>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8 text-center relative">
          {/* Character/Icon with Navigation Buttons */}
          <div className="flex justify-center items-center mb-6 relative">
            {/* Left Arrow */}
            <div className="absolute left-0 sm:left-4 lg:left-8">
              {currentSlide > 0 && (
                <Button
                  onClick={handlePrevious}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-indigo-300 text-indigo-600 shadow-md hover:shadow-lg transition-all duration-200"
                  variant="outline"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
            </div>

            {/* Character Icon */}
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].subtitle}
              width={300}
              height={300}
              className="w-40 h-40 sm:w-50 sm:h-50 lg:w-75 lg:h-75"
            />

            {/* Right Arrow */}
            <div className="absolute right-0 sm:right-4 lg:right-8">
              {currentSlide < slides.length - 1 && (
                <Button
                  onClick={handleNext}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-indigo-300 text-indigo-600 shadow-md hover:shadow-lg transition-all duration-200"
                  variant="outline"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Subtitle */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            {slides[currentSlide].subtitle}
          </h3>

          {/* Description */}
          <div className="px-4 sm:px-8 lg:px-16 mb-8">
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-full lg:max-w-3xl mx-auto">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Start Survey Button (on last slide) */}
          {currentSlide === slides.length - 1 && (
            <Button
              onClick={handleNext}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base mb-4"
            >
              {surveyType === "secure"
                ? "Mulai Kuis Sekarang"
                : "Mulai Berbagi Cerita"}
            </Button>
          )}
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-6 md:mt-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotNavigation(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-indigo-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
