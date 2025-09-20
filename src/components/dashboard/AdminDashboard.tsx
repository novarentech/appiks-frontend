"use client";

import { Card, CardContent } from "../ui/card";
import { Edit3, UserPlus } from "lucide-react";
import AdminPanel from "./panels/AdminPanel";
import NewContentCard from "../data-display/cards/NewContent";
import NewUserCard from "../data-display/cards/NewUser";

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
        <NewContentCard />
        {/* Pengguna Terbaru */}
        <NewUserCard />
      </div>
      {/* Aksi Cepat */}
      <h3 className="text-lg font-semibold">Aksi Cepat</h3>
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
