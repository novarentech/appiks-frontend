"use client";

import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import ReferralCard from "@/components/dashboard/ReferralCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { mockReferrals } from "@/lib/mockPsychologistData";
import { Referral } from "@/types/api";
import { Search } from "lucide-react";

export default function RujukanMasukPage() {
  return (
    <RoleGuard permissionType="rujukan-masuk">
      <RujukanMasukContent />
    </RoleGuard>
  );
}

function RujukanMasukContent() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    // In a real app, this would be an API call with filters
    const fetchReferrals = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setReferrals(mockReferrals);
    };

    fetchReferrals();
  }, []);

  // Filter local data for demo purposes
  const filteredReferrals = referrals.filter((referral) => {
    const matchSearch = referral.student_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || referral.status.toLowerCase() === statusFilter.toLowerCase();
    const matchPriority = priorityFilter === "all" || referral.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Inbox Rujukan Masuk" 
        subtitle="Konfirmasi atau tolak permintaan jadwal konsultasi" 
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input 
            placeholder="Cari nama siswa..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Status Rujukan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="menunggu konfirmasi">Menunggu Konfirmasi</SelectItem>
            <SelectItem value="terkonfirmasi">Terkonfirmasi</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
            <SelectItem value="ditolak">Ditolak</SelectItem>
            <SelectItem value="kadaluarsa">Kadaluarsa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Tingkat Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prioritas</SelectItem>
            <SelectItem value="kritis">Kritis</SelectItem>
            <SelectItem value="prioritas">Prioritas</SelectItem>
          </SelectContent>
        </Select>
        
        <Select>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Batas Waktu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Waktu</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="kadaluarsa">Kadaluarsa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredReferrals.length > 0 ? (
          filteredReferrals.map((referral) => (
            <ReferralCard key={referral.id} referral={referral} />
          ))
        ) : (
          <div className="text-center py-12 bg-white border rounded-xl text-gray-500">
            Tidak ada rujukan yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
