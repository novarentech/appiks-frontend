"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const breathingVideos = {
  short: "YOUTUBE_ID_1",
  medium: "YOUTUBE_ID_2",
  long: "YOUTUBE_ID_3",
};

export default function BreathingVideoPage() {
  const { key } = useParams();
  const router = useRouter();
  const videoId = breathingVideos[key as keyof typeof breathingVideos];
  const { isLoading, isAuthenticated, isVerified } = useAuth();
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(
    null
  );

  // Handle feedback selection (local state only)
  const handleFeedback = (isHelpful: boolean) => {
    const feedbackType = isHelpful ? "helpful" : "not-helpful";

    // Toggle feedback - if same feedback is clicked, remove it
    if (feedback === feedbackType) {
      setFeedback(null);
    } else {
      setFeedback(feedbackType);
    }
  };
  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Video tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
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
          Latihan Pernapasan (Breathing Exercise)
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Video panduan pernapasan untuk relaksasi
        </p>
      </div>

      <Card className="mb-6 max-w-5xl">
        <CardContent className="p-6 sm:px-10">
          <div className="font-bold text-2xl mb-4">
            Coba lakukan teknik pernafasan ini!
          </div>
          <div className="aspect-video w-full rounded-xl overflow-hidden border">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Panduan Pernapasan"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-5xl">
        <CardContent className="space-y-6">
          <h4 className="font-semibold text-gray-900">
            Apakah video ini bermanfaat?
          </h4>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback(true)}
              className={`bg-white transition-colors ${
                feedback === "helpful"
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "hover:bg-green-50 hover:border-green-300 hover:text-green-700"
              }`}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              {feedback === "helpful" ? "Bermanfaat " : "Bermanfaat"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback(false)}
              className={`bg-white transition-colors ${
                feedback === "not-helpful"
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "hover:bg-red-50 hover:border-red-300 hover:text-red-700"
              }`}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              {feedback === "not-helpful"
                ? "Tidak Bermanfaat "
                : "Tidak Bermanfaat"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
