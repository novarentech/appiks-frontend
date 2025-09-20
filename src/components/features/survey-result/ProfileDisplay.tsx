"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProfileDisplayProps {
  imageSrc: string;
  imageAlt: string;
  name: string;
  subtitle: string;
  additionalInfo?: {
    label: string;
    value: string;
  };
}

export function ProfileDisplay({
  imageSrc,
  imageAlt,
  name,
  subtitle,
  additionalInfo,
}: ProfileDisplayProps) {
  return (
    <motion.div
      className="text-center mb-6"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.6 }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={300}
        height={300}
        className="w-32 h-32 sm:w-50 sm:h-50 lg:w-75 lg:h-75 mx-auto mb-4 hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4 sm:p-6">
        <p className="text-lg sm:text-xl font-bold mb-2">{name}</p>
        <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
        {additionalInfo && (
          <div className="mt-3">
            <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs sm:text-sm lg:text-base">
              {additionalInfo.label}: {additionalInfo.value}
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
}
