"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ArrowRight, BookOpen, Calendar } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    description: string;
    thumbnail?: string; // Optional article image
    tags: string[];
    category: string;
    readTime?: string;
    publishedDate?: string;
    author?: string;
  };
  onRead?: (articleId: number) => void;
  className?: string;
}

export function ArticleCard({ article, onRead, className = "" }: ArticleCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleRead = () => {
    onRead?.(article.id);
  };

  return (
    <Card 
      className={`group overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer pt-0 pb-2 ${className}`}
      onClick={handleRead}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRead();
        }
      }}
      aria-label={`Read article: ${article.title}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {/* Loading skeleton */}
        {isImageLoading && article.thumbnail && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
          </div>
        )}
        
        {/* Article Thumbnail or Placeholder */}
        {article.thumbnail && !imageError ? (
          <Image
            src={article.thumbnail}
            alt={`Thumbnail for ${article.title}`}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setImageError(true);
              setIsImageLoading(false);
            }}
            priority={false}
          />
        ) : (
          // Fallback placeholder
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <span className="text-xs text-blue-600 font-medium">Artikel</span>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <Badge className="absolute top-3 left-3 bg-gray-100 text-gray-700 backdrop-blur-sm border-0 text-xs rounded-full">
          {article.category}
        </Badge>

        {/* Read time badge */}
        {article.readTime && (
          <Badge className="absolute bottom-3 right-3 bg-black/80 text-white backdrop-blur-sm border-0 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 text-lg">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {article.description}
        </p>

        {/* Article meta info */}
        {(article.author || article.publishedDate) && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {article.author && <span>Oleh {article.author}</span>}
            {article.author && article.publishedDate && <span>•</span>}
            {article.publishedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{article.publishedDate}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
          {article.tags.slice(0, 3).map((tag, tagIndex) => (
            <Badge
              key={tagIndex}
              variant="secondary"
              className= " bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-2 py-0.5 transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {article.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-2 py-0.5"
            >
              +{article.tags.length - 3}
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
              handleRead();
            }}
            aria-label={`Read ${article.title}`}
          >
            Baca
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}