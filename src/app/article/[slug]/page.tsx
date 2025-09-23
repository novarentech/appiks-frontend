"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Clock,
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useArticleDetail } from "@/hooks/useArticleDetail";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading, isAuthenticated, isVerified } = useAuth();
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);

  // Get article slug from URL
  const articleSlug = params.slug as string;

  // Fetch article detail from API
  const {
    data: article,
    loading: articleLoading,
    error: articleError,
  } = useArticleDetail(articleSlug);

  // Auth check
  if (isLoading || articleLoading) {
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

  if (!article || articleError) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Artikel tidak ditemukan
          </h1>
          <Button onClick={() => router.push("/education-content")}>
            Kembali ke Daftar Artikel
          </Button>
        </div>
      </div>
    );
  }

  const handleGoBack = () => {
    router.push("/education-content");
  };

  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful);
    // In real implementation, send feedback to API
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group"
            onClick={handleGoBack}
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Daftar Artikel
          </Button>
        </div>

        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 p-6 sm:p-8">
          {/* Tags */}
          <div className="px-6 pt-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Tags would be displayed here if they were part of the API response */}
            </div>
          </div>

          {/* Title */}
          <div className="px-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>
          </div>

          {/* Meta Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>5 menit</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Admin</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Introduction */}
          <div className="my-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {article.description}
            </p>
          </div>

          {/* Content */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Apakah artikel ini bermanfaat?
          </h3>
          <div className="flex gap-4">
            <Button
              variant={isHelpful === true ? "default" : "outline"}
              onClick={() => handleFeedback(true)}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              Bermanfaat
            </Button>
            <Button
              variant={isHelpful === false ? "default" : "outline"}
              onClick={() => handleFeedback(false)}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              Tidak
            </Button>
          </div>
          {isHelpful !== null && (
            <p className="text-sm text-gray-600 mt-4">
              Terima kasih atas feedback Anda!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
