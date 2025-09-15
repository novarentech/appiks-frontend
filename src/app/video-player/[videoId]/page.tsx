"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useVideoDetail } from "@/hooks/useVideos";
import { ChevronLeft, ThumbsUp, ThumbsDown, Clock, Eye } from "lucide-react";

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading, isAuthenticated, isVerified } = useAuth();
  const videoId = params.videoId as string;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(
    null
  );

  // Fetch video details from API
  const {
    data: video,
    loading: videoLoading,
    error: videoError,
  } = useVideoDetail(videoId);

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

  // Auth check
  if (isLoading || videoLoading) {
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

  if (videoError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Terjadi kesalahan
          </h2>
          <p className="text-gray-600 mb-4">{videoError}</p>
          <Button onClick={() => router.push("/videos")}>
            Kembali ke Video
          </Button>
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
          <Button onClick={() => router.push("/videos")}>
            Kembali ke Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
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
                  {video.channel}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {video.school}
                </Badge>
                {video.tags && video.tags.length > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {video.tags[0].title}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {video.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{video.views.toLocaleString()} views</span>
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
                  src={`https://www.youtube.com/embed/${video.video_id}?autoplay=0&rel=0&modestbranding=1`}
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
      </div>
    </div>
  );
}
