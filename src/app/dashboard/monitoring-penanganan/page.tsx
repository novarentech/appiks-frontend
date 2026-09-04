"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, User, ChevronRight, Users, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockMonitoringStats, mockMonitoringCases } from "@/data/mockMonitoring";
import { MonitoringCaseCard } from "@/components/dashboard/MonitoringCaseCard";

export default function MonitoringPenangananPage() {
  return (
    <RoleGuard permissionType="monitoring-penanganan">
      <MonitoringPenangananContent />
    </RoleGuard>
  );
}

function MonitoringPenangananContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [waktuFilter, setWaktuFilter] = useState("all");
  const [guruFilter, setGuruFilter] = useState("all");

  const today = new Date().toLocaleDateString("id-ID", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getStatIcon = (type: string) => {
    switch (type) {
      case "aktif":
        return <Users className="w-5 h-5" />;
      case "selesai":
        return <CheckCircle className="w-5 h-5" />;
      case "rujukan":
        return <Activity className="w-5 h-5" />;
      case "sla":
        return <User className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const filteredCases = mockMonitoringCases.filter((item) => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesWaktu = waktuFilter === "all" || item.slaStatus === waktuFilter;
    return matchesSearch && matchesStatus && matchesWaktu;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Monitoring Penanganan Kasus Siswa
          </h1>
          <p className="text-gray-500 mt-1">Pantau kondisi siswa</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg border border-gray-100 text-sm font-medium">
          <Calendar className="w-4 h-4 text-gray-500" />
          {today}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        {mockMonitoringStats.map((stat, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-4 ${index !== mockMonitoringStats.length - 1 ? 'md:border-r border-gray-100' : ''}`}
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              {getStatIcon(stat.iconType)}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-indigo-600">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Cari nama siswa..." 
            className="pl-9 h-10 w-full rounded-lg border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px] h-10 rounded-lg border-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Belum Ditangani BK">Belum Ditangani BK</SelectItem>
            <SelectItem value="Sedang Ditangani BK">Sedang Ditangani BK</SelectItem>
            <SelectItem value="Dirujuk ke Psikolog">Dirujuk ke Psikolog</SelectItem>
            <SelectItem value="Diselesaikan">Diselesaikan</SelectItem>
          </SelectContent>
        </Select>
        <Select value={waktuFilter} onValueChange={setWaktuFilter}>
          <SelectTrigger className="w-full md:w-[200px] h-10 rounded-lg border-gray-200">
            <SelectValue placeholder="Batas Waktu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Waktu</SelectItem>
            <SelectItem value="DALAM BATAS WAKTU">Dalam Batas Waktu</SelectItem>
            <SelectItem value="MELEBIHI BATAS WAKTU">Melebihi Batas Waktu</SelectItem>
          </SelectContent>
        </Select>
        <Select value={guruFilter} onValueChange={setGuruFilter}>
          <SelectTrigger className="w-full md:w-[200px] h-10 rounded-lg border-gray-200">
            <SelectValue placeholder="Guru BK" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Guru BK</SelectItem>
            <SelectItem value="Sri Wahyuni, S.Pd, M.Pd">Sri Wahyuni, S.Pd, M.Pd</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List of Cases */}
      <div className="space-y-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((item) => (
            <MonitoringCaseCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center py-12 bg-white border rounded-xl text-gray-500">
            Tidak ada data kasus yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
