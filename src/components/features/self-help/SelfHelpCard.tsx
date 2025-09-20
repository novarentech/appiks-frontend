"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SelfHelpCardProps {
  title: string;
  description: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  link?: string;
}

export function SelfHelpCard({
  title,
  description,
  category,
  imageSrc,
  imageAlt,
  className,
  link,
}: SelfHelpCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const router = useRouter();

  const handleCardClick = () => {
    if (link) router.push(link);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (link) router.push(link);
  };

  return (
    <Card
      className={`group overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full pt-0 ${className}`}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden ">
        <Image
          src={imageSrc}
          alt={imageAlt || `Thumbnail for ${title}`}
          fill
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsImageLoading(false)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Badge className="absolute top-3 left-3 bg-gray-100 text-gray-700 backdrop-blur-sm border-0 text-xs rounded-full">
          {category}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 text-lg">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mt-4">
          <Button size="sm" className="w-full" onClick={handleButtonClick}>
            Mulai
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
