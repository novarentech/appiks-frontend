"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Video, FileText, UserPlus, Edit3, Calendar } from "lucide-react";
import AdminPanel from "../components/panel/adminPanel";

// Mock data - replace with real data from your API
const mockContent = [
  {
    id: 1,
    title: "Membangun Kesadaran Diri & Kesehatan Mental di Kalangan Siswa",
    type: "Video",
    date: "27 Agustus 2025",
  },
  {
    id: 2,
    title:
      "Stop Intoleransi: Wujudkan Lingkungan Sekolah yang Peduli & Sehat Mental",
    type: "Artikel",
    date: "27 Agustus 2025",
  },
  {
    id: 3,
    title:
      "Pentingnya Self-Awareness bagi Siswa untuk Cegah Tekanan Mental & Intoleransi",
    type: "Artikel",
    date: "27 Agustus 2025",
  },
];

const mockUsers = [
  {
    id: 1,
    name: "Rina Sari Dewi",
    role: "Siswa",
    initials: "RD",
    date: "27 Agustus 2025",
  },
  {
    id: 2,
    name: "Anna Visconti",
    role: "Guru Wali",
    initials: "AV",
    date: "27 Agustus 2025",
  },
  {
    id: 3,
    name: "Astrid Andersen",
    role: "Guru BK",
    initials: "AA",
    date: "27 Agustus 2025",
  },
];

const quickActions = [
  {
    id: 1,
    title: "Tambah Pengguna",
    description: "Buat akun baru untuk guru atau siswa",
    icon: UserPlus,
    action: () => console.log("Add user"),
  },
  {
    id: 2,
    title: "Buat Konten",
    description: "Tambah artikel atau pengumuman baru",
    icon: Edit3,
    action: () => console.log("Create content"),
  },
  {
    id: 3,
    title: "Lihat Profil Saya",
    description: "Lihat profil saya",
    icon: UserPlus,
    action: () => console.log("View profile"),
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-gray-600 mt-2">
          Kelola Akun dan Konten dengan Mudah
        </p>
      </div>

      <AdminPanel />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Konten Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Konten Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockContent.map((content) => (
              <div
                key={content.id}
                className="border-l-4 border-blue-500 pl-4 py-2"
              >
                <h3 className="font-medium text-sm leading-tight mb-2">
                  {content.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={content.type === "Video" ? "default" : "secondary"}
                    className={`text-xs ${
                      content.type === "Video"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                  >
                    {content.type === "Video" ? (
                      <>
                        <Video className="w-3 h-3 mr-1" />
                        Video
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3 mr-1" />
                        Artikel
                      </>
                    )}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {content.date}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pengguna Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Pengguna Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="border-l-4 border-cyan-500 pl-4 py-2"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{user.name}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      user.role === "Siswa"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                        : user.role === "Guru Wali"
                        ? "bg-pink-100 text-pink-700 border-pink-300"
                        : "bg-blue-100 text-blue-700 border-blue-300"
                    }`}
                  >
                    {user.role}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {user.date}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {/* Aksi Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card
            key={action.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent>
              <action.icon className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-base">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
