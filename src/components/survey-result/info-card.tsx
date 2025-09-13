"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface InfoCardProps {
  title: string;
  content: string;
  color: string;
  className?: string;
  showImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right" | "top" | "bottom";
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function InfoCard({
  title,
  content,
  color,
  className = "",
  showImage = false,
  imageSrc = "/icon/ico-walk-3.webp",
  imageAlt = "Icon",
  imagePosition = "right",
}: InfoCardProps) {
  // Function to get layout classes based on image position
  const getLayoutClasses = () => {
    if (!showImage) return "text-center";

    switch (imagePosition) {
      case "left":
        return "flex flex-col lg:flex-row-reverse items-center gap-4";
      case "right":
        return "flex flex-col lg:flex-row items-center gap-4";
      case "top":
        return "flex flex-col-reverse items-center gap-4 text-center";
      case "bottom":
        return "flex flex-col items-center gap-4 text-center";
      default:
        return "flex flex-col lg:flex-row items-center gap-4";
    }
  };

  const getTextClasses = () => {
    if (!showImage) return "";

    switch (imagePosition) {
      case "left":
      case "right":
        return "flex-1 text-left";
      case "top":
      case "bottom":
        return "text-center";
      default:
        return "flex-1 text-left";
    }
  };
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-${color} overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className={`bg-${color} p-3 sm:p-4 lg:p-6`}>
        <h3 className="text-white text-sm sm:text-lg lg:text-xl font-bold text-center">
          {title}
        </h3>
      </div>
      <div className={`p-3 sm:p-4 lg:p-6 ${getLayoutClasses()}`}>
        <p className={`text-xs sm:text-sm lg:text-base ${getTextClasses()}`}>
          {content}
        </p>
        {showImage && (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={60}
            height={60}
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
          />
        )}
      </div>
    </motion.div>
  );
}
