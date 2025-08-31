"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, ArrowRight, Youtube } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface VideoCardProps {
  video: {
    id: number;
    title: string;
    description: string;
    youtubeId: string; // Changed from thumbnail to youtubeId
    tags: string[];
    category: string;
    duration?: string;
  };
  onPlay?: (videoId: number) => void;
  className?: string;
}

// Helper function to get YouTube thumbnail URL
const getYouTubeThumbnail = (youtubeId: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'hqdefault') => {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
};

export function VideoCard({ video, onPlay, className = "" }: VideoCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handlePlay = () => {
    onPlay?.(video.id);
  };

  // Get YouTube thumbnail URL
  const thumbnailUrl = getYouTubeThumbnail(video.youtubeId);
  const fallbackThumbnailUrl = getYouTubeThumbnail(video.youtubeId, 'default');

  return (
    <Card 
      className={`group overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer pt-0 pb-2 ${className}`}
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePlay();
        }
      }}
      aria-label={`Play video: ${video.title}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {/* Loading skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
          </div>
        )}
        
        {/* YouTube Thumbnail */}
        {!imageError ? (
          <Image
            src={thumbnailUrl}
            alt={`Thumbnail for ${video.title}`}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              // Try fallback thumbnail
              if (thumbnailUrl !== fallbackThumbnailUrl) {
                setImageError(false);
                // This will trigger a re-render with fallback URL
              } else {
                setImageError(true);
                setIsImageLoading(false);
              }
            }}
            priority={false}
          />
        ) : (
          // Fallback placeholder
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
            <div className="text-center">
              <Youtube className="w-12 h-12 text-primary mx-auto mb-2" />
              <span className="text-xs text-primary font-medium">YouTube Video</span>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-primary text-white rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg hover:bg-primary/90">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Category badge */}
        <Badge className="absolute top-3 left-3 bg-gray-100 text-gray-700 backdrop-blur-sm border-0 text-xs rounded-full">
          {video.category}
        </Badge>

        {/* Duration badge */}
        {video.duration && (
          <Badge className="absolute bottom-3 right-3 bg-black/80 text-white backdrop-blur-sm border-0 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 text-lg">
          {video.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {video.description}
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
          {video.tags.slice(0, 3).map((tag, tagIndex) => (
            <Badge
              key={tagIndex}
              variant="secondary"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-2 py-0.5 transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {video.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-2 py-0.5 transition-colors"
            >
              +{video.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 h-auto flex-shrink-0 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            aria-label={`Play ${video.title}`}
          >
            Tonton
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}