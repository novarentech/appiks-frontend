"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  AlertCircle,
  Video as VideoIcon,
  BookOpen,
} from "lucide-react";
import { VideoCard } from "@/components/ui/video-card";
import { ArticleCard } from "@/components/ui/edu-card";
import { VideoGridSkeleton } from "@/components/ui/video-skeleton";
import { FilterSkeleton } from "@/components/ui/filter-skeleton";
import { useRouter } from "next/navigation";
import { useTags } from "@/hooks/useTags";
import { useContent, useContentByTags, isVideo, isArticle } from "@/hooks/useContent";
import { ContentItem } from "@/types/api";
import { Video } from "@/types/video";

// Type definition for Article
interface Article {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  category: string;
  readTime?: string;
  publishedDate?: string;
  author?: string;
}

// Adapter function to convert ContentItem to Video format
function contentToVideo(content: ContentItem): Video {
  if (!isVideo(content)) {
    throw new Error("Content is not a video");
  }
  
  const videoContent = content as ContentItem & { duration: string; channel: string; views: number; video_id: string };
  
  return {
    id: content.id,
    title: content.title,
    description: content.description,
    thumbnail: content.thumbnail,
    duration: videoContent.duration,
    channel: videoContent.channel,
    views: videoContent.views,
    video_id: videoContent.video_id,
    school: "", // API doesn't provide school info
    tags: content.tags.map(tag => ({
      id: tag.id,
      title: tag.title
    }))
  };
}

// Adapter function to convert ContentItem to Article format
function contentToArticle(content: ContentItem): Article {
  if (!isArticle(content)) {
    throw new Error("Content is not an article");
  }
  
  return {
    id: content.id,
    title: content.title,
    description: content.description,
    thumbnail: content.thumbnail,
    tags: content.tags.map(tag => tag.title),
    category: content.tags.length > 0 ? content.tags[0].title : "Umum",
    readTime: "5 menit",
    publishedDate: new Date().toISOString().split('T')[0], // Default to today
    author: "Admin" // Default value since API doesn't provide this
  };
}

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function AngerManagement() {
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [contentType, setContentType] = useState<"all" | "video" | "article">("all");
  const router = useRouter();

  // Fetch data from APIs
  const { data: tags, loading: tagsLoading, error: tagsError } = useTags();
  const {
    data: allContent,
    loading: contentLoading,
    error: contentError,
  } = useContent();
  const { data: filteredByTagContent, loading: tagContentLoading } =
    useContentByTags(selectedTagIds);

  // Use filtered content if tags are selected, otherwise use all content
  const contentToShow =
    selectedTagIds.length > 0 ? filteredByTagContent : allContent;
  const isLoading = tagsLoading || contentLoading || tagContentLoading;
  const hasError = tagsError || contentError;

  // Generate category colors dynamically
  const getTagColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
      "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
      "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200",
      "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
      "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
    ];
    return colors[index % colors.length];
  };

  // Count videos for each tag
  const getVideoCountForTag = (tagId: number) => {
    if (!allContent) return 0;
    return allContent.filter((content) =>
      isVideo(content) && content.tags.some((tag) => tag.id === tagId)
    ).length;
  };

  const handleTagClick = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearAllFilters = () => {
    setSelectedTagIds([]);
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const hasActiveFilters = selectedTagIds.length > 0;

  const handleVideoPlay = (videoId: string) => {
    router.push(`/video-player/${videoId}`);
  };

  const handleReadArticle = (articleSlug: string) => {
    // Implementasi navigasi ke halaman artikel jika ada
    router.push(`/article/${articleSlug}`);
  };

  // Gabungkan video dan artikel jika "all" dipilih
  const showVideos = contentType === "all" || contentType === "video";
  const showArticles = contentType === "all" || contentType === "article";

  // Filter content berdasarkan tipe
  const videos = contentToShow?.filter(isVideo) || [];
  const articles = contentToShow?.filter(isArticle) || [];

  // Acak urutan video dan artikel
  const shuffledVideos = showVideos ? shuffleArray(videos) : [];
  const shuffledArticles = showArticles ? shuffleArray(articles) : [];

  // Gabungkan dan acak jika "all", jika tidak tampilkan sesuai filter
  type MixedContentItem =
    | { type: "video"; data: ContentItem }
    | { type: "article"; data: ContentItem };
  
  let mixedContent: MixedContentItem[] = [];
  if (contentType === "all") {
    mixedContent = shuffleArray([
      ...shuffledVideos.map((v) => ({ type: "video" as const, data: v })),
      ...shuffledArticles.map((a) => ({ type: "article" as const, data: a })),
    ]);
  }

  const totalContent =
    (showVideos ? shuffledVideos.length : 0) +
    (showArticles ? shuffledArticles.length : 0);

  return (
    <>
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
          Video & Artikel Rekomendasi
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Pilihan Video dan Artikel untuk Menemani Perjalananmu
        </p>
      </div>

      <div>
        {/* Filter Bar */}
        {tagsLoading ? (
          <FilterSkeleton />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row mb-2 gap-4 items-start sm:items-center justify-between ">
              {/* Filter Info */}
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Konten
                </h3>
              </div>

              {/* Content Type Filter */}
              <div className="flex gap-2">
                <Button
                  variant={contentType === "all" ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setContentType("all")}
                >
                  <Filter className="w-4 h-4" />
                  Semua
                </Button>
                <Button
                  variant={contentType === "video" ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setContentType("video")}
                >
                  <VideoIcon className="w-4 h-4" />
                  Video
                </Button>
                <Button
                  variant={contentType === "article" ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setContentType("article")}
                >
                  <BookOpen className="w-4 h-4" />
                  Artikel
                </Button>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter Tag
                </Button>
              </div>
            </div>
            <div className="mb-4">
              {hasActiveFilters && tags && (
                <div className="flex flex-wrap gap-2">
                  {selectedTagIds.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    return tag ? (
                      <Badge
                        key={`selected-tag-${tagId}`}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        {tag.title}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            {/* Filter Section */}
            {showFilters && (
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Kategori
                    </span>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Filter
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag, index) => (
                    <Button
                      key={`tag-${tag.id}`}
                      variant="outline"
                      size="sm"
                      className={`transition-all duration-200 hover:scale-105 ${
                        selectedTagIds.includes(tag.id)
                          ? `${getTagColor(
                              index
                            )} ring-2 ring-offset-1 ring-current border-current`
                          : `${getTagColor(index)} border-current`
                      }`}
                      onClick={() => handleTagClick(tag.id)}
                    >
                      <span>{tag.title}</span>
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-white/80 text-current h-5 px-1.5 text-xs"
                      >
                        {getVideoCountForTag(tag.id)}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Menampilkan {totalContent} konten
            {hasActiveFilters && tags && (
              <span className="ml-1 text-blue-600 font-medium">
                (kategori:{" "}
                {selectedTagIds
                  .map((tagId) => tags.find((tag) => tag.id === tagId)?.title)
                  .filter(Boolean)
                  .join(", ")}
                )
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          {/* Loading State */}
          {isLoading && <VideoGridSkeleton count={6} />}

          {/* Error State */}
          {hasError && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Terjadi Kesalahan
                </h3>
                <p className="text-gray-600 mb-6">
                  {hasError || "Gagal memuat data konten"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          )}

          {/* Video & Article Grid */}
          {!isLoading && !hasError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentType === "all"
                ? mixedContent.map((item) =>
                    item.type === "video" ? (
                      <VideoCard
                        key={`video-${item.data.id}`}
                        video={contentToVideo(item.data)}
                        onPlay={handleVideoPlay}
                      />
                    ) : (
                      <ArticleCard
                        key={`article-${item.data.id}`}
                        article={contentToArticle(item.data)}
                        onRead={() => handleReadArticle(isArticle(item.data) ? item.data.slug : '')}
                      />
                    )
                  )
                : (
                  <>
                    {showVideos &&
                      shuffledVideos.length > 0 &&
                      shuffledVideos.map((video) => (
                        <VideoCard
                          key={`video-${video.id}`}
                          video={contentToVideo(video)}
                          onPlay={handleVideoPlay}
                        />
                      ))}
                    {showArticles &&
                      shuffledArticles.length > 0 &&
                      shuffledArticles.map((article) => (
                        <ArticleCard
                          key={`article-${article.id}`}
                          article={contentToArticle(article)}
                          onRead={() => handleReadArticle(isArticle(article) ? article.slug : '')}
                        />
                      ))}
                  </>
                )}
            </div>
          )}

          {/* No Results */}
          {!isLoading &&
            !hasError &&
            ((showVideos && shuffledVideos.length === 0) ||
              (showArticles && shuffledArticles.length === 0)) && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tidak ada konten ditemukan
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Coba pilih kategori yang berbeda atau reset filter.
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Filter
                  </Button>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}