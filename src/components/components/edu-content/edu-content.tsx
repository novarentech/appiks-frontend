"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Filter,
  RotateCcw,
  SlidersHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ArticleCard } from "@/components/ui/edu-card";

const categories = [
  {
    name: "Mindfulness",
    color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
    articleCount: 3,
  },
  {
    name: "Stress Relief",
    color:
      "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
    articleCount: 2,
  },
  {
    name: "Sleep",
    color: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200",
    articleCount: 2,
  },
  {
    name: "Anxiety",
    color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
    articleCount: 1,
  },
  {
    name: "Meditation",
    color:
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
    articleCount: 2,
  },
];

// Articles data
const articles = [
  {
    id: 1,
    title: "Memahami Dasar-Dasar Mindfulness",
    description:
      "Panduan lengkap untuk memahami konsep mindfulness dan cara menerapkannya dalam kehidupan sehari-hari untuk kesehatan mental yang lebih baik.",
    thumbnail: "/images/articles/mindfulness-basics.jpg",
    tags: ["Mindfulness", "Kesehatan Mental", "Wellbeing", "Tips"],
    category: "Mindfulness",
    readTime: "5 menit",
    publishedDate: "15 Agt 2025",
    author: "Dr. Sarah Kim",
  },
  {
    id: 2,
    title: "10 Teknik Mengatasi Stres di Tempat Kerja",
    description:
      "Strategi praktis dan mudah diterapkan untuk mengelola stres di lingkungan kerja agar tetap produktif dan sehat mental.",
    tags: ["Stres", "Kerja", "Produktivitas", "Tips"],
    category: "Stress Relief",
    readTime: "7 menit",
    publishedDate: "12 Agt 2025",
    author: "Prof. Michael Chen",
  },
  {
    id: 3,
    title: "Rutinitas Tidur yang Sehat untuk Kesehatan Mental",
    description:
      "Cara membangun rutinitas tidur yang berkualitas untuk mendukung kesehatan mental dan fisik yang optimal.",
    tags: ["Tidur", "Rutinitas", "Kesehatan", "Mental Health"],
    category: "Sleep",
    readTime: "6 menit",
    publishedDate: "10 Agt 2025",
    author: "Dr. Lisa Wong",
  },
  {
    id: 4,
    title: "Mengenali dan Mengatasi Serangan Kecemasan",
    description:
      "Panduan untuk mengidentifikasi gejala serangan kecemasan dan teknik-teknik efektif untuk mengatasinya.",
    tags: ["Kecemasan", "Panic Attack", "Coping", "Mental Health"],
    category: "Anxiety",
    readTime: "8 menit",
    publishedDate: "8 Agt 2025",
    author: "Dr. James Park",
  },
  {
    id: 5,
    title: "Panduan Meditasi untuk Pemula: Langkah Pertama",
    description:
      "Tutorial step-by-step untuk memulai praktik meditasi dari nol, termasuk teknik dasar dan tips untuk konsisten.",
    tags: ["Meditasi", "Pemula", "Tutorial", "Spiritual"],
    category: "Meditation",
    readTime: "10 menit",
    publishedDate: "5 Agt 2025",
    author: "Guru Meditation Center",
  },
  {
    id: 6,
    title: "Praktik Mindfulness dalam Kehidupan Sehari-hari",
    description:
      "Cara mudah mengintegrasikan praktik mindfulness ke dalam aktivitas harian tanpa mengganggu rutinitas.",
    tags: ["Mindfulness", "Daily Practice", "Lifestyle", "Awareness"],
    category: "Mindfulness",
    readTime: "4 menit",
    publishedDate: "3 Agt 2025",
    author: "Mindful Living Team",
  },
  {
    id: 7,
    title: "Teknik Relaksasi untuk Mengurangi Stres",
    description:
      "Berbagai metode relaksasi yang terbukti efektif untuk mengurangi tingkat stres dan meningkatkan kualitas hidup.",
    tags: ["Relaksasi", "Stres", "Teknik", "Wellbeing"],
    category: "Stress Relief",
    readTime: "6 menit",
    publishedDate: "1 Agt 2025",
    author: "Wellness Clinic",
  },
  {
    id: 8,
    title: "Membangun Lingkungan Tidur yang Ideal",
    description:
      "Tips praktis untuk menciptakan kamar tidur yang mendukung kualitas tidur yang optimal dan kesehatan mental.",
    tags: ["Sleep Environment", "Bedroom", "Quality Sleep", "Health"],
    category: "Sleep",
    readTime: "5 menit",
    publishedDate: "28 Jul 2025",
    author: "Sleep Foundation",
  },
  {
    id: 9,
    title: "Meditasi Pernapasan: Teknik dan Manfaatnya",
    description:
      "Eksplorasi mendalam tentang teknik meditasi pernapasan dan bagaimana praktik ini dapat mengubah kesehatan mental Anda.",
    tags: ["Meditasi", "Pernapasan", "Breathing", "Mindfulness"],
    category: "Meditation",
    readTime: "9 menit",
    publishedDate: "25 Jul 2025",
    author: "Meditation Institute",
  },
  {
    id: 10,
    title: "Mindful Eating: Makan dengan Kesadaran Penuh",
    description:
      "Pendekatan mindful eating untuk meningkatkan hubungan yang sehat dengan makanan dan mendukung kesehatan mental.",
    tags: ["Mindful Eating", "Nutrition", "Awareness", "Health"],
    category: "Mindfulness",
    readTime: "7 menit",
    publishedDate: "22 Jul 2025",
    author: "Nutrition Wellness Center",
  },
];

export function EduContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Filtered content based on category
  const filteredContent = useMemo(() => {
    if (selectedCategory) {
      return articles.filter((item) => item.category === selectedCategory);
    }
    return articles;
  }, [selectedCategory]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(
      selectedCategory === categoryName ? null : categoryName
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const hasActiveFilters = !!selectedCategory;

  const handleArticleRead = (articleId: number) => {
    const article = articles.find((a) => a.id === articleId);
    if (article) {
      router.push(`/article/${article.id}`);
    }
  };

  return (
    <div>
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
          Konten Edukasi
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Artikel untuk Menemani Perjalanan Kesehatan Mentalmu
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row mb-2 gap-4 items-start sm:items-center justify-between ">
          {/* Filter Info */}
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Artikel
            </h3>
          </div>

          {/* Controls */}
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </Button>
        </div>
        <div className="mb-4">
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {selectedCategory}
            </Badge>
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
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant="outline"
                  size="sm"
                  className={`transition-all duration-200 hover:scale-105 ${
                    selectedCategory === category.name
                      ? `${category.color} ring-2 ring-offset-1 ring-current border-current`
                      : `${category.color} border-current`
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <span>{category.name}</span>
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-white/80 text-current h-5 px-1.5 text-xs"
                  >
                    {category.articleCount}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          Menampilkan {filteredContent.length} dari {articles.length} artikel
          {hasActiveFilters && (
            <span className="ml-1 text-blue-600 font-medium">
              (kategori: {selectedCategory})
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredContent.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onRead={handleArticleRead}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada artikel ditemukan
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
  );
}