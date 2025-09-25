"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown,
  Tag as TagIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useArticleDetail } from "@/hooks/useArticleDetail";
import { LexicalViewer } from "@/components/blocks/LexicalViewer";

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
    router.back();
  };

  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful);
  };

  // Calculate reading time (rough estimate: 200 words per minute)
  const calculateReadingTime = (content: string) => {
    try {
      const parsedContent =
        typeof content === "string" ? JSON.parse(content) : content;
      const textContent = extractTextFromLexical(parsedContent);
      const words = textContent.split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      return `${minutes} menit`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "5 menit";
    }
  };

  // Helper function to extract text from Lexical content for reading time calculation
  interface LexicalTextNode {
    type: "text";
    text?: string;
  }

  interface LexicalElementNode {
    type: string;
    children?: Array<LexicalTextNode | LexicalElementNode>;
  }

  interface LexicalRootNode {
    children?: Array<LexicalTextNode | LexicalElementNode>;
  }

  interface LexicalContent {
    root: LexicalRootNode;
  }

  const extractTextFromLexical = (content: LexicalContent): string => {
    if (!content || !content.root) return "";

    const extractText = (
      node: LexicalTextNode | LexicalElementNode
    ): string => {
      if (node.type === "text") {
        return (node as LexicalTextNode).text || "";
      }

      if ("children" in node && node.children && Array.isArray(node.children)) {
        return node.children.map(extractText).join(" ");
      }

      return "";
    };

    return content.root.children?.map(extractText).join(" ") || "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto lg:px-8 py-8">
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

        {/* Article Content */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Header */}
          <div className="p-6 sm:p-8">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {article.tags.map((tag: any) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {article.content
                    ? calculateReadingTime(article.content)
                    : "5 menit"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Admin</span>
              </div>
            </div>

            {/* Featured Image */}
            {article.thumbnail && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden ">
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
          </div>

          {/* Article Content */}
          <div className="px-6 sm:pb-8 pb-8">
            {article.content ? (
              <LexicalViewer
                content={article.content}
                className="article-content border-0 bg-transparent shadow-none"
              />
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                Konten artikel tidak tersedia
              </div>
            )}
          </div>
        </article>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Apakah artikel ini bermanfaat?
          </h3>
          <div className="flex gap-4">
            <Button
              variant={isHelpful === true ? "default" : "outline"}
              onClick={() => handleFeedback(true)}
              className={`flex items-center gap-2 ${
                isHelpful === true
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-green-300 text-green-600 hover:bg-green-50"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              Bermanfaat
            </Button>
            <Button
              variant={isHelpful === false ? "default" : "outline"}
              onClick={() => handleFeedback(false)}
              className={`flex items-center gap-2 ${
                isHelpful === false
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "border-red-300 text-red-600 hover:bg-red-50"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              Tidak Bermanfaat
            </Button>
          </div>
          {isHelpful !== null && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ✓ Terima kasih atas feedback Anda! Feedback Anda membantu kami
                meningkatkan kualitas konten.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom styles for better article reading experience */}
      <style jsx>{`
        .article-content {
          line-height: 1.8;
        }

        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          color: #1f2937;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .article-content p {
          margin-bottom: 1.25rem;
          color: #374151;
        }

        .article-content blockquote {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-left: 4px solid #3b82f6;
          padding: 1rem;
          margin: 1.5rem 0;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .article-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #dc2626;
          font-family: "JetBrains Mono", "Fira Code", monospace;
        }

        .article-content pre {
          background: #1f2937 !important;
          border-radius: 0.5rem;
          overflow-x: auto;
          padding: 1rem;
          margin: 1.5rem 0;
        }

        .article-content pre code {
          background: transparent;
          color: #e5e7eb;
          padding: 0;
        }

        .article-content ul,
        .article-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .article-content li {
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .article-content a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .article-content a:hover {
          color: #1d4ed8;
        }

        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .article-content th,
        .article-content td {
          border: 1px solid #d1d5db;
          padding: 0.75rem;
          text-align: left;
        }

        .article-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
