"use client";

import { AngerManagement } from "@/components/features/anger-management/AngerManagement";

export default function StudentContent() {
  return (
    <div className="min-h-screen p-4 container mx-auto max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Konten Edukasi
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Temukan dukungan, panduan, dan alat interaktif yang dirancang khusus
          untuk membantu mu mengatasi tantangan mental dan emosional
        </p>
      </div>
      <AngerManagement />
    </div>
  );
}
