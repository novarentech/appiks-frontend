"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Clock,
} from "lucide-react";

// Mock data - dalam implementasi nyata, ambil dari API berdasarkan videoId
const videoData = {
  ZToicYcHIOU: {
    title: "Mengapa Self Awareness Penting untuk Kesehatan Mental?",
    description:
      "Self awareness atau kesadaran diri adalah kemampuan untuk memahami diri sendiri secara mendalam. Video ini membahas mengapa self awareness sangat penting untuk kesehatan mental dan bagaimana cara mengembangkannya dalam kehidupan sehari-hari.",
    category: "Self-Awareness",
    subcategory: "Kesehatan Mental",
    tags: ["Edukasi"],
    publishDate: "24 Oct 2021",
    duration: "8:45",
  },
  inpok4MKVLM: {
    title: "Mengatasi Stres Harian",
    description:
      "Cara efektif mengelola stres dalam kehidupan sehari-hari dengan teknik pernapasan yang mudah dipraktikkan.",
    category: "Stress Relief",
    subcategory: "Manajemen Stres",
    tags: ["Relaksasi"],
    publishDate: "15 Sep 2021",
    duration: "5:12",
  },
};

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading, isAuthenticated, isVerified } = useAuth();
  const videoId = params.videoId as string;
  const [showFullDescription, setShowFullDescription] = useState(false);

  const video = videoData[videoId as keyof typeof videoData];

  useEffect(() => {
    if (!video) {
      router.push("/video-recommendations");
    }
  }, [video, router]);

  // Auth check
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

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Video tidak ditemukan
          </h2>
          <p className="text-gray-600 mb-4">
            Video yang Anda cari tidak tersedia.
          </p>
          <Button onClick={() => router.push("/video-recommendations")}>
            Kembali ke Video Rekomendasi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-0 h-auto text-gray-600 hover:text-gray-900 group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Button>
      </div>

      <div>
        {/* Main Video Section */}
        <div className="space-y-6">
          {/* Video Info */}
          <Card>
            <CardContent className="space-y-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {video.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {video.subcategory}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {video.tags[0]}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {video.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{video.publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{video.duration}</span>
                </div>
              </div>

              <div className="aspect-video bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Deskripsi
                </h3>
                <div
                  className={`text-gray-700 leading-relaxed ${
                    !showFullDescription ? "line-clamp-3" : ""
                  }`}
                >
                  {video.description}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="p-0 h-auto text-blue-600 hover:text-blue-700"
                >
                  {showFullDescription
                    ? "Tampilkan lebih sedikit"
                    : "Tampilkan selengkapnya"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="space-y-6">
              <h4 className="font-semibold text-gray-900">
                Apakah video ini bermanfaat?
              </h4>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Bermanfaat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Tidak Bermanfaat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
