"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Calendar, User, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Sample article data - dalam implementasi nyata, ini akan diambil dari API
const articlesData = [
  {
    id: 1,
    title: "Memahami Dasar-Dasar Mindfulness",
    description: "Panduan lengkap untuk memahami konsep mindfulness dan cara menerapkannya dalam kehidupan sehari-hari untuk kesehatan mental yang lebih baik.",
    thumbnail: "/images/articles/mindfulness-basics.jpg",
    tags: ["Self-Awareness", "Kesehatan Mental", "Emosi"],
    category: "Mindfulness",
    readTime: "5 menit",
    publishedDate: "20/01/2025",
    author: "Dr. Sarah Kim",
    content: {
      introduction: "Pernahkah kamu merasa tiba-tiba bad mood, kesel, atau stres tapi nggak tahu kenapa? 😔 Nah, di sinilah self-awareness atau kesadaran diri jadi penting banget.",
      sections: [
        {
          title: "Apa sih Self-Awareness itu?",
          content: "Self-awareness itu kemampuan kita untuk mengenali perasaan, pikiran, dan tindakan diri sendiri. Singkatnya, ngerti apa yang kamu rasain dan kenapa kamu ngerasain itu.\n\nContoh:\n• Kamu sadar kalau kamu lagi gampang marah karena kurang tidur.\n• Kamu tahu kalau grogi saat presentasi karena belum latihan cukup.\n• Dengan self-awareness, kita nggak cuma 'merasakan emosi', tapi juga ngerti asal-usulnya."
        },
        {
          title: "Kenapa Penting Buat Kesehatan Mental?",
          content: "1. Bikin lebih tenang\n   Kalau tahu kenapa lagi kesel atau sedih, kamu bisa lebih cepat nyari cara nenengin diri.\n\n2. Lebih gampang ambil keputusan\n   Kamu jadi bisa mikir dulu sebelum bertindak. Misalnya, 'Aku lagi emosi nih, sebaiknya diam dulu darpada nyakitin orang.'\n\n3. Bikin hubungan lebih sehat\n   Saat paham perasaan sendiri, kamu juga lebih peka sama orang lain. Ini bikin hubungan sama teman atau keluarga jadi lebih baik.\n\n4. Mencegah stres berlebihan\n   Dengan sadar kapan kamu butuh istirahat, kamu bisa jaga energi dan kesehatan mentalmu tetap stabil."
        },
        {
          title: "Gimana Cara Latih Self-Awareness?",
          content: "Nggak ribet kok, coba mulai dari hal kecil nih:\n\n• Tulis jurnal singkat tentang apa yang kamu rasain hari itu.\n• Tarik napas dan refleksi 1 menit sebelum tidur.\n• Perhatikan responmu saat ada masalah: kamu marah, sedih, atau cuek?\n• Ngobrolin dengan diri sendiri (self-talk), tanya 'Aku kenapa ya ngerasa gini?'"
        }
      ],
      conclusion: "Self-awareness itu kayak punya 'cermin batin' buat diri sendiri.\n\nSemakin sering kamu melatihinya, semakin kamu ngerti dirimu dan bisa menjaga kesehatan mental dengan lebih baik.\n\nJadi, yuk mulai biasakan kenali perasaanmu setiap hari. Karena kalau bukan kamu yang peduli sama diri sendiri, siapa lagi? 🤗"
    }
  },
  {
    id: 2,
    title: "10 Teknik Mengatasi Stres di Tempat Kerja",
    description: "Strategi praktis dan mudah diterapkan untuk mengelola stres di lingkungan kerja agar tetap produktif dan sehat mental.",
    tags: ["Stres", "Kerja", "Produktivitas", "Tips"],
    category: "Stress Relief",
    readTime: "7 menit",
    publishedDate: "12/01/2025",
    author: "Prof. Michael Chen",
    content: {
      introduction: "Stres di tempat kerja adalah hal yang wajar, tapi kalau dibiarkan terus-menerus bisa berdampak buruk pada kesehatan mental dan produktivitas.",
      sections: [
        {
          title: "Kenali Sumber Stres",
          content: "Langkah pertama adalah mengidentifikasi apa yang membuat Anda stres:\n• Beban kerja yang berlebihan\n• Deadline yang ketat\n• Konflik dengan rekan kerja\n• Lingkungan kerja yang tidak mendukung"
        },
        {
          title: "Teknik Manajemen Waktu",
          content: "1. Prioritaskan tugas dengan metode Eisenhower Matrix\n2. Buat to-do list yang realistis\n3. Gunakan teknik Pomodoro untuk fokus\n4. Sisakan waktu buffer untuk hal-hal tak terduga"
        },
        {
          title: "Teknik Relaksasi di Kantor",
          content: "• Lakukan breathing exercise 5 menit setiap 2 jam\n• Stretching ringan di meja kerja\n• Meditasi singkat saat istirahat\n• Dengarkan musik yang menenangkan"
        }
      ],
      conclusion: "Mengelola stres di tempat kerja membutuhkan konsistensi dan kesabaran. Mulailah dengan teknik yang paling mudah diterapkan, lalu tingkatkan secara bertahap."
    }
  }
];

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading, isAuthenticated, isVerified } = useAuth();
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);

  // Auth check
  if (isLoading) {
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

  // Find article by ID
  const articleId = parseInt(params.id as string);
  const article = articlesData.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel tidak ditemukan</h1>
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
              {article.tags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-blue-100 text-blue-700 text-sm px-3 py-1"
                >
                  {tag}
                </Badge>
              ))}
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
                <span>{article.publishedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
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
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Introduction */}
          <div className="my-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {article.content.introduction}
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {article.content.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="prose max-w-none">
                  {section.content.split('\n').map((paragraph, pIndex) => {
                    if (paragraph.trim() === '') return null;
                    
                    // Handle bullet points
                    if (paragraph.trim().startsWith('•')) {
                      return (
                        <p key={pIndex} className="text-gray-700 leading-relaxed mb-2 ml-4">
                          {paragraph.trim()}
                        </p>
                      );
                    }
                    
                    // Handle numbered lists
                    if (/^\d+\./.test(paragraph.trim())) {
                      return (
                        <p key={pIndex} className="text-gray-700 leading-relaxed mb-2 ml-4">
                          {paragraph.trim()}
                        </p>
                      );
                    }
                    
                    // Regular paragraphs
                    return (
                      <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                        {paragraph.trim()}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          {article.content.conclusion && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Penutup</h2>
              <div className="prose max-w-none">
                {article.content.conclusion.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return null;
                  return (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
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