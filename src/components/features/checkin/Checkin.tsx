"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { recordMood } from "@/lib/api";
import { MoodRecordResponse } from "@/types/api";

import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
  StepperTitle,
} from "@/components/ui/stepper";
import { Check, CircleCheck, XCircle } from "lucide-react";
import Image from "next/image";

const STEPS = [
  {
    step: 1,
    title: "mood check-in",
    description: "bagaimana perasaanmu hari ini?",
  },
  { step: 2, title: "hasil", description: "ringkasan check-in" },
] as const;

const SAFE_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Mainkan Game",
    subtitle: "Yuk, coba game asyik ini",
    color: "from-pink-200 to-violet-200",
    icon: "/icon/ico-games.svg",
  },
  {
    id: 2,
    title: "Akses Video",
    subtitle: "Klik untuk nonton konten keren",
    color: "from-green-100 to-green-50",
    icon: "/icon/ico-video.svg",
  },
  {
    id: 3,
    title: "Navigator Masa Depan",
    subtitle: "Yuk Rakit Peta Petualangan Karirmu!",
    color: "from-violet-100 to-violet-50",
    icon: "/icon/ico-walk-2.webp",
  },
  {
    id: 4,
    title: "Quote of The Day",
    subtitle: "Baca & renungkan kata bijak hari ini",
    color: "from-violet-100 to-violet-50",
    icon: "/icon/ico-quotes.svg",
  },
] as const;

const UNSAFE_RECOMMENDATIONS = [
  {
    id: 5,
    title: "Self Help",
    subtitle: "Tips dan teknik langsung untuk membantu mengelola emosi Anda",
    color: "from-blue-100 to-blue-50",
    icon: "/icon/ico-self-help.svg",
  },
  {
    id: 6,
    title: "Ekspedisi Menemukan Jati Diri",
    subtitle: "Mulai Petualangan Mengenal Kekuatan Super-Mu!",
    color: "from-violet-100 to-violet-50",
    icon: "/icon/ico-survey-2.webp",
  },
  {
    id: 7,
    title: "Anger Management",
    subtitle: "Teknik khusus untuk mengelola kemarahan dan frustrasi",
    color: "from-red-100 to-red-50",
    icon: "/icon/ico-anger-management.svg",
  },
  {
    id: 8,
    title: "Quote of The Day",
    subtitle: "Dapatkan inspirasi harianmu. Baca & renungkan kata bijak hari ini",
    color: "from-yellow-100 to-yellow-50",
    icon: "/icon/ico-quotes.svg",
  },
  {
    id: 9,
    title: "Curhat",
    subtitle:
      "Tempat aman buat cerita apa aja. Yuk, ceritain isi hati kamu di sini ! ",
    color: "from-emerald-100 to-emerald-50",
    icon: "/icon/ico-vent.svg",
  },
] as const;

const SAFE_ROUTES: Record<number, string> = {
  1: "/game",
  2: "/videos",
  3: "/survey-walkthrough",
  4: "/quote",
} as const;

const UNSAFE_ROUTES: Record<number, string> = {
  5: "/self-help",
  6: "/survey-walkthrough",
  7: "/anger-management",
  8: "/quote",
  9: "/share-thing",
} as const;

const MOOD_OPTIONS = [
  {
    key: "gembira",
    label: "Gembira",
    emoji: "😄",
    icon: "/icon/ico-happy.webp",
  },
  {
    key: "netral",
    label: "Netral",
    emoji: "🙂",
    icon: "/icon/ico-neutral.webp",
  },
  { key: "sedih", label: "Sedih", emoji: "😢", icon: "/icon/ico-sad.webp" },
  { key: "marah", label: "Marah", emoji: "😡", icon: "/icon/ico-angry.webp" },
] as const;

// Mapping from mood keys to API status values
const MOOD_TO_API_STATUS: Record<MoodKey, string> = {
  gembira: "happy",
  netral: "neutral",
  sedih: "sad",
  marah: "angry",
} as const;

// Types
type MoodKey = (typeof MOOD_OPTIONS)[number]["key"];

interface MoodData {
  iconPath: string;
  title: string;
  status: string;
  color: string;
  statusIcon: React.ComponentType<{ className?: string }>;
  isSafe: boolean;
}

const MOOD_MAP: Record<MoodKey, MoodData> = {
  gembira: {
    iconPath: "/icon/ico-save.svg",
    title: "Pertahankan Energi Positifmu!",
    status: "Aman",
    color: "text-green-600",
    statusIcon: CircleCheck,
    isSafe: true,
  },
  netral: {
    iconPath: "/icon/ico-save.svg",
    title: "Tetap Jaga Keseharianmu",
    status: "Aman",
    color: "text-green-600",
    statusIcon: CircleCheck,
    isSafe: true,
  },
  sedih: {
    iconPath: "/icon/ico-unsave.svg",
    title: "Terima Perasaanmu",
    status: "Tidak Aman",
    color: "text-red-600",
    statusIcon: XCircle,
    isSafe: false,
  },
  marah: {
    iconPath: "/icon/ico-unsave.svg",
    title: "Tenangkan Diri Terlebih Dahulu",
    status: "Tidak Aman",
    color: "text-red-600",
    statusIcon: XCircle,
    isSafe: false,
  },
} as const;

export default function CheckIn() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [selectedRec, setSelectedRec] = useState<number | null>(null);
  const [moodResponse, setMoodResponse] = useState<MoodRecordResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Memoized values
  const selectedMoodData = useMemo(() => {
    if (!mood) return null;

    // If we have API response, use its status to determine safety
    if (moodResponse?.data) {
      const localMoodData = MOOD_MAP[mood];
      return {
        ...localMoodData,
        status: moodResponse.data.status,
        isSafe: moodResponse.data.isSafe,
        statusIcon: moodResponse.data.isSafe ? CircleCheck : XCircle,
        color: moodResponse.data.isSafe ? "text-green-600" : "text-red-600",
        iconPath: moodResponse.data.isSafe
          ? "/icon/ico-save.svg"
          : "/icon/ico-unsave.svg",
      };
    }

    // Fallback to local mapping if no API response yet
    return MOOD_MAP[mood];
  }, [mood, moodResponse]);

  const currentRecommendations = useMemo(() => {
    // Use API response if available, otherwise fallback to local mapping
    const isSafe = moodResponse?.data?.isSafe ?? selectedMoodData?.isSafe;
    return isSafe ? SAFE_RECOMMENDATIONS : UNSAFE_RECOMMENDATIONS;
  }, [selectedMoodData?.isSafe, moodResponse?.data?.isSafe]);

  const currentRoutes = useMemo(() => {
    // Use API response if available, otherwise fallback to local mapping
    const isSafe = moodResponse?.data?.isSafe ?? selectedMoodData?.isSafe;
    return isSafe ? SAFE_ROUTES : UNSAFE_ROUTES;
  }, [selectedMoodData?.isSafe, moodResponse?.data?.isSafe]);

  const recommendationTitle = useMemo(() => {
    // Use API response if available, otherwise fallback to local mapping
    const isSafe = moodResponse?.data?.isSafe ?? selectedMoodData?.isSafe;
    return isSafe
      ? "Rekomendasi Konten Untukmu"
      : "Yuk, Kenali & Kelola Emosimu di Sini";
  }, [selectedMoodData?.isSafe, moodResponse?.data?.isSafe]);

  const headerTitle = useMemo(
    () => (currentStep === 1 ? "Mood Check-In" : "Hasil"),
    [currentStep]
  );

  const headerDescription = useMemo(
    () =>
      currentStep === 1
        ? "Luangkan waktu sejenak untuk merefleksikan perasaanmu. Informasi ini akan membantu kami memberikan dukungan yang tepat untukmu."
        : "Luangkan waktu sejenak untuk memahami perasaanmu. Hasil ini membantu mengenali diri lebih baik dan menemukan dukungan yang tepat.",
    [currentStep]
  );

  const buttonText = useMemo(
    () => (currentStep === STEPS.length ? "Lanjutkan" : "Lanjutkan"),
    [currentStep]
  );

  const isNextDisabled = useMemo(() => {
    if (currentStep === 1) return !mood;
    if (currentStep === 2) return !selectedRec;
    return false;
  }, [currentStep, mood, selectedRec]);

  // Event handlers
  const handleMoodSelect = useCallback(async (moodKey: MoodKey) => {
    setMood(moodKey);
    setSelectedRec(null);
    setError(null);
    setIsLoading(true);
    try {
      const apiStatus = MOOD_TO_API_STATUS[moodKey];
      const response = await recordMood(apiStatus);
      setMoodResponse(response);
      if (!response.success) {
        throw new Error(response.message || "Failed to record mood");
      }

      // Save isSafe value to sessionStorage for other components to use
      try {
        sessionStorage.setItem(
          "mood_is_safe",
          JSON.stringify(response.data.isSafe)
        );
        console.log(
          "✅ Mood isSafe value saved to sessionStorage:",
          response.data.isSafe
        );
      } catch (storageError) {
        console.error(
          "❌ Failed to save isSafe to sessionStorage:",
          storageError
        );
      }

      // Setelah mood dipilih dan respons diterima, langsung ke step 2
      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record mood");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRecSelect = useCallback((recId: number) => {
    setSelectedRec(recId);
  }, []);

  const handleFinish = useCallback(() => {
    if (!selectedRec) return;

    const route = currentRoutes[selectedRec];
    if (!route) return;

    // Set session storage flag if navigating to quote page
    if (route === "/quote") {
      try {
        sessionStorage.setItem("quote_access_from_checkin", "true");
        console.log("✅ Quote access flag set from checkin");
      } catch (error) {
        console.error("❌ Failed to set quote access flag:", error);
      }
    }

    // Reset state
    setMood(null);
    setSelectedRec(null);
    setCurrentStep(1);
    setMoodResponse(null);
    setError(null);
    router.push(route);
  }, [selectedRec, router, currentRoutes]);

  const goNext = useCallback(() => {
    if (currentStep === 2 && !selectedRec) return;
    if (currentStep >= STEPS.length) {
      handleFinish();
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  }, [currentStep, selectedRec, handleFinish]);

  // Render components
  const renderMoodSelection = () => (
    <div className="text-center">
      <h3 className="text-lg sm:text-xl font-semibold mb-2">
        Bagaimana perasaanmu hari ini?
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
        Pilih ikon yang paling menggambarkan suasana hatimu saat ini
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mx-auto">
        {MOOD_OPTIONS.map((item) => {
          const selected = mood === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleMoodSelect(item.key)}
              className={`relative flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-lg border p-3 sm:p-4 transition-all duration-200 min-h-[80px] sm:min-h-[100px]
                ${
                  selected
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border bg-background hover:border-primary/50"
                }
                hover:shadow-sm active:scale-95`}
              aria-pressed={selected}
              aria-label={`Pilih mood ${item.label}`}
            >
              {selected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-sm flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <Image
                width="32"
                height="32"
                src={item.icon}
                alt={item.label}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-xs sm:text-sm font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="mt-6 sm:mt-8 text-left">
      <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center sm:text-left">
        {recommendationTitle}
      </h4>

      <div className="space-y-3 sm:space-y-4">
        {currentRecommendations.map((rec) => {
          const active = selectedRec === rec.id;
          return (
            <button
              key={rec.id}
              type="button"
              onClick={() => handleRecSelect(rec.id)}
              className={`w-full rounded-lg border p-4 sm:p-5 flex items-center justify-between transition-all duration-200
                ${
                  active
                    ? "border-primary ring-2 ring-primary/40 bg-primary/5 scale-[1.02]"
                    : "border-border bg-background hover:border-primary/50 hover:shadow-md"
                }`}
              aria-pressed={active}
              aria-label={`Pilih ${rec.title}`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center bg-gradient-to-br ${rec.color} flex-shrink-0`}
                  aria-hidden="true"
                >
                  <Image
                    width={32}
                    height={32}
                    src={rec.icon}
                    alt={rec.title}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">
                    {rec.title}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {rec.subtitle}
                  </div>
                </div>
              </div>
              <div
                className={`text-xs sm:text-sm font-medium flex-shrink-0 ml-2 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active ? "✓ Dipilih" : "Pilih"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderResults = () => {
    const StatusIcon = selectedMoodData?.statusIcon;

    return (
      <div className="text-center">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Image
            width="64"
            height="64"
            src={selectedMoodData?.iconPath || "/icon/ico-happy.webp"}
            alt={selectedMoodData?.title || "Mood icon"}
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
          <h3 className="text-lg sm:text-xl font-semibold px-4">
            {selectedMoodData?.title || "Terima kasih"}
          </h3>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-muted-foreground">Status mu :</span>
            <div className="flex items-center gap-1">
              <span
                className={`font-medium ${
                  selectedMoodData?.color || "text-muted-foreground"
                }`}
              >
                {selectedMoodData?.status || "—"}
              </span>
              {StatusIcon && (
                <StatusIcon className={`w-4 h-4 ${selectedMoodData?.color}`} />
              )}
            </div>
          </div>
        </div>
        {renderRecommendations()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 lg:space-y-10">
          <Stepper value={currentStep}>
            {STEPS.map(({ step, title }) => (
              <StepperItem
                key={step}
                step={step}
                loading={isLoading}
                className="relative flex-1 flex-col!"
              >
                <StepperTrigger className="flex-col gap-3 rounded z-1">
                  <StepperIndicator />
                  <div className="space-y-0.5 px-2">
                    <StepperTitle>{title}</StepperTitle>
                  </div>
                </StepperTrigger>
                {step < STEPS.length && (
                  <StepperSeparator className="absolute inset-x-0 top-5 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
                )}
              </StepperItem>
            ))}
          </Stepper>

          {/* Header */}
          <header className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
              {headerTitle}
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground px-4">
              {headerDescription}
            </p>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Step content card */}
          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-lg border bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
              {currentStep === 1 && renderMoodSelection()}
              {currentStep === 2 && renderResults()}
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center justify-end">
            <Button
              onClick={goNext}
              disabled={isNextDisabled}
              className="min-w-[100px]"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
