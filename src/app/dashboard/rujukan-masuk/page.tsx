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
import { useEffect, useState, useCallback, useRef } from "react";
import { Referral } from "@/types/api";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getPsychologistReferrals } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const [batasWaktuFilter, setBatasWaktuFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchReferrals = useCallback(async () => {
    if (page === 1) setIsLoading(true);
    else setIsFetchingMore(true);
    try {
      const response = await getPsychologistReferrals({
        page,
        limit: 10,
        status: statusFilter,
        priority: priorityFilter,
        batas_waktu: batasWaktuFilter,
        search,
      });

      if (response.success && response.data) {
        const mappedReferrals: Referral[] = response.data.data.map((item) => {
          const deadline = new Date(item.deadline_at);
          const now = new Date();
          const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
          let priority = "Prioritas";
          if (diffHours < 24) priority = "Kritis";

          let status = "Menunggu Konfirmasi";
          if (item.status === "confirmed") status = "Terkonfirmasi";
          else if (item.status === "rejected") status = "Ditolak";
          else if (item.status === "selesai") status = "Selesai";

          let remainingTimeStr = "";
          const isExpired = deadline.getTime() < now.getTime();
          if (!isExpired) {
            const diffDays = Math.floor(diffHours / 24);
            const remainingHours = Math.floor(diffHours % 24);
            remainingTimeStr = `${diffDays} hari ${remainingHours} jam`;
          }

          return {
            id: item.id.toString(),
            student_name: item.student?.name || "Tanpa Nama",
            priority,
            status,
            remaining_time: remainingTimeStr,
            date: item.slot?.slot_date || "-",
            time: item.slot ? `${item.slot.slot_start_time.slice(0,5)} - ${item.slot.slot_end_time.slice(0,5)}` : "-",
            referrer_name: item.counseling?.counselor?.name || "Guru BK",
            counselor_notes: item.counseling?.notes || "-",
            submitted_at: new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            }),
            is_expired: isExpired,
          };
        });

        if (page === 1) {
          setReferrals(mappedReferrals);
        } else {
          setReferrals((prev) => {
            const newIds = mappedReferrals.map((r) => r.id);
            const filteredPrev = prev.filter((r) => !newIds.includes(r.id));
            return [...filteredPrev, ...mappedReferrals];
          });
        }
        
        setTotalPages(response.data.meta.last_page || 1);
      } else {
        if (page === 1) setReferrals([]);
        toast.error(response.message || "Gagal memuat daftar rujukan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat memuat daftar rujukan");
      if (page === 1) setReferrals([]);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [page, statusFilter, priorityFilter, batasWaktuFilter, search]);

  useEffect(() => {
    // Reset page to 1 when filters change
    setPage(1);
  }, [statusFilter, priorityFilter, batasWaktuFilter, search]);

  useEffect(() => {
    // Adding a debounce for search and filter changes
    const delayDebounceFn = setTimeout(() => {
      fetchReferrals();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchReferrals]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !isLoading && !isFetchingMore) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [page, totalPages, isLoading, isFetchingMore]);

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
        
        <Select value={batasWaktuFilter} onValueChange={setBatasWaktuFilter}>
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
      <div className="space-y-4 relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-xl">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        )}
        
        {referrals.length > 0 ? (
          <>
            {referrals.map((referral) => (
              <ReferralCard key={referral.id} referral={referral} />
            ))}
            
            {/* Infinite Scroll Target */}
            <div ref={observerTarget} className="py-6 flex justify-center items-center">
              {isFetchingMore && <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />}
              {!isFetchingMore && page === totalPages && (
                <span className="text-sm text-gray-400">Semua rujukan telah dimuat</span>
              )}
            </div>
          </>
        ) : (
          !isLoading && (
            <div className="text-center py-12 bg-white border rounded-xl text-gray-500">
              Tidak ada rujukan yang ditemukan.
            </div>
          )
        )}
      </div>
    </div>
  );
}
