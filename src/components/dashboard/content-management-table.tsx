"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Play,
  Quote,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateArticleDialog } from "./dialogs/create-article-dialog";
import { CreateVideoDialog } from "./dialogs/create-video-dialog";
import { CreateQuoteDialog } from "./dialogs/create-quote-dialog";
import { EditArticleDialog } from "./dialogs/edit-article-dialog";
import { EditVideoDialog } from "./dialogs/edit-video-dialog";
import { EditQuoteDialog } from "./dialogs/edit-quote-dialog";
import { DeleteContentDialog } from "./dialogs/delete-content-dialog";

// Type definitions
export interface ContentItem {
  id: string;
  title: string;
  type: "Artikel" | "Video" | "Quotes";
  createdAt: string;
  thumbnail?: string;
  url?: string;
  content?: string;
  author?: string;
  category?: string;
}

// Sample data - replace with actual API call
const sampleData: ContentItem[] = [
  {
    id: "1",
    title: "Self-Awareness untuk Siswa: Kunci Hidup Sehat & Bahagia",
    type: "Artikel",
    createdAt: "27/08/2025 10:00 AM",
    thumbnail: "/image/imgPic.webp",
    content: "Content about self-awareness...",
    author: "Admin",
    category: "Self Awareness",
  },
  {
    id: "2",
    title: "Stop Intoleransi di Lingkungan Sekolah",
    type: "Video",
    createdAt: "27/08/2025 10:00 AM",
    url: "https://youtube.com/cara-menjaga-kondisi-emosional",
    category: "Self Awareness",
  },
  {
    id: "3",
    title: "Stop Intoleransi di Lingkungan Sekolah",
    type: "Video",
    createdAt: "27/08/2025 10:00 AM",
    url: "https://youtube.com/stop-intoleransi",
    category: "Mental Health",
  },
  {
    id: "4",
    title: "Self-Awareness untuk Siswa: Kunci Hidup Sehat & Bahagia",
    type: "Artikel",
    createdAt: "27/08/2025 10:00 AM",
    content: "Another article content...",
    category: "Self Awareness",
  },
  {
    id: "5",
    title:
      "Satu-satunya hal yang akan membuatmu bahagia adalah mencintai siapa dirimu",
    type: "Quotes",
    createdAt: "27/08/2025 10:00 AM",
    content: "Inspiring quote content...",
    author: "Unknown",
  },
  {
    id: "6",
    title: "Percayalah pada dirimu sendiri dan semua yang ada dalam...",
    type: "Quotes",
    createdAt: "27/08/2025 10:00 AM",
    content: "Another inspiring quote...",
    author: "Unknown",
  },
  {
    id: "7",
    title: "Tidak setiap hari harus sempurna",
    type: "Quotes",
    createdAt: "27/08/2025 10:00 AM",
    content: "Daily motivation quote...",
    author: "Unknown",
  },
];

export function ContentManagementTable() {
  const router = useRouter();
  const [data, setData] = useState<ContentItem[]>(sampleData);
  const [searchQuery, setSearchQuery] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false);
  const [isCreateVideoOpen, setIsCreateVideoOpen] = useState(false);
  const [isCreateQuoteOpen, setIsCreateQuoteOpen] = useState(false);
  const [isEditArticleOpen, setIsEditArticleOpen] = useState(false);
  const [isEditVideoOpen, setIsEditVideoOpen] = useState(false);
  const [isEditQuoteOpen, setIsEditQuoteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Filter and search functionality
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        contentTypeFilter === "all" ||
        (contentTypeFilter === "article" && item.type === "Artikel") ||
        (contentTypeFilter === "video" && item.type === "Video") ||
        (contentTypeFilter === "quote" && item.type === "Quotes");

      return matchesSearch && matchesType;
    });
  }, [data, searchQuery, contentTypeFilter]);

  const handleView = (item: ContentItem) => {
    if (item.type === "Video") {
      router.push(`/video-player/${item.id}`);
    } else if (item.type === "Artikel") {
      router.push(`/article/${item.id}`);
    }
    // Quotes don't have view functionality
  };

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    if (item.type === "Artikel") {
      setIsEditArticleOpen(true);
    } else if (item.type === "Video") {
      setIsEditVideoOpen(true);
    } else if (item.type === "Quotes") {
      setIsEditQuoteOpen(true);
    }
  };

  const handleDelete = (item: ContentItem) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      setData((prevData) =>
        prevData.filter((row) => row.id !== selectedItem.id)
      );
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  const columns: ColumnDef<ContentItem>[] = [
    {
      accessorKey: "title",
      header: "Judul Konten",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="font-medium text-gray-900 max-w-md">{item.title}</div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Jenis",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const getTypeColor = (type: string) => {
          switch (type) {
            case "Artikel":
              return "bg-blue-100 text-blue-800";
            case "Video":
              return "bg-green-100 text-green-800";
            case "Quotes":
              return "bg-purple-100 text-purple-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <Badge variant="secondary" className={getTypeColor(type)}>
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Waktu Dibuat",
      cell: ({ row }) => {
        return <div className="text-gray-600">{row.getValue("createdAt")}</div>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {/* View button - only for Video and Article */}
              {(item.type === "Video" || item.type === "Artikel") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(item)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lihat Konten</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Edit button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>

              {/* Delete button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hapus</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Controls Row - Search, Filter, Rows per page, and Create Button */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side - Search and Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari konten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-80"
            />
          </div>

          {/* Content Type Filter */}
          <Select
            value={contentTypeFilter}
            onValueChange={setContentTypeFilter}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="article">Artikel</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="quote">Quote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Rows per page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Baris per halaman:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Right side - Create Content Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Buat Konten
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsCreateArticleOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Artikel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreateVideoOpen(true)}>
                <Play className="mr-2 h-4 w-4" />
                Video
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreateQuoteOpen(true)}>
                <Quote className="mr-2 h-4 w-4" />
                Quote
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        showColumnToggle={false}
        showPagination={true}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        showPageSizeSelector={false}
      />

      {/* Dialogs */}
      <CreateArticleDialog
        open={isCreateArticleOpen}
        onOpenChange={setIsCreateArticleOpen}
        onSuccess={(newArticle: ContentItem) => {
          setData((prevData) => [...prevData, newArticle]);
          setIsCreateArticleOpen(false);
        }}
      />

      <CreateVideoDialog
        open={isCreateVideoOpen}
        onOpenChange={setIsCreateVideoOpen}
        onSuccess={(newVideo: ContentItem) => {
          setData((prevData) => [...prevData, newVideo]);
          setIsCreateVideoOpen(false);
        }}
      />

      <CreateQuoteDialog
        open={isCreateQuoteOpen}
        onOpenChange={setIsCreateQuoteOpen}
        onSuccess={(newQuote: ContentItem) => {
          setData((prevData) => [...prevData, newQuote]);
          setIsCreateQuoteOpen(false);
        }}
      />

      <EditArticleDialog
        open={isEditArticleOpen}
        onOpenChange={setIsEditArticleOpen}
        article={selectedItem}
        onSuccess={(updatedArticle: ContentItem) => {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === updatedArticle.id ? updatedArticle : item
            )
          );
          setIsEditArticleOpen(false);
          setSelectedItem(null);
        }}
      />

      <EditVideoDialog
        open={isEditVideoOpen}
        onOpenChange={setIsEditVideoOpen}
        video={selectedItem}
        onSuccess={(updatedVideo: ContentItem) => {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === updatedVideo.id ? updatedVideo : item
            )
          );
          setIsEditVideoOpen(false);
          setSelectedItem(null);
        }}
      />

      <EditQuoteDialog
        open={isEditQuoteOpen}
        onOpenChange={setIsEditQuoteOpen}
        quote={selectedItem}
        onSuccess={(updatedQuote: ContentItem) => {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === updatedQuote.id ? updatedQuote : item
            )
          );
          setIsEditQuoteOpen(false);
          setSelectedItem(null);
        }}
      />

      <DeleteContentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        contentItem={selectedItem}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
