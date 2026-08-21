"use client";

import { DashboardHeader } from "./DashboardHeader";
import PsychologistPanel from "./panels/PsychologistPanel";
import ReferralAlert from "./ReferralAlert";
import ReferralCard from "./ReferralCard";
import { useEffect, useState } from "react";
import { mockPsychologistStats } from "@/lib/mockPsychologistData";
import { Referral } from "@/types/api";
import { getPendingReferrals } from "@/lib/api";

export function PsychologistDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getPendingReferrals();
        if (response.success && response.data) {
          const mappedReferrals: Referral[] = response.data.map((item) => {
            // Determine priority
            const deadline = new Date(item.deadline_at);
            const now = new Date();
            const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
            let priority = "Prioritas";
            if (diffHours < 24) priority = "Kritis";

            // Determine status
            let status = "Menunggu Konfirmasi";
            if (item.status === "confirmed") status = "Terkonfirmasi";
            else if (item.status === "rejected") status = "Ditolak";

            // Calculate remaining time string
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
          
          // Get only the first 2 referrals that need approval for the dashboard preview
          const pendingReferrals = mappedReferrals
            .filter(r => r.status === "Menunggu Konfirmasi")
            .slice(0, 2);
            
          setReferrals(pendingReferrals);
        }
        
        // Use real stat count if available, falling back to mock for now
        setAlertCount(response.data?.length || mockPsychologistStats.pending_confirmation_count);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Selamat Datang" 
        subtitle="Kelola Akun dan Konten dengan Mudah" 
      />

      <PsychologistPanel />

      <ReferralAlert count={alertCount} />

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Referral Masuk</h2>
          <p className="text-gray-500 text-sm mt-1">
            Rujukan siswa dari Guru BK yang perlu ditindaklanjuti
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          {referrals.length > 0 ? (
            referrals.map((referral) => (
              <ReferralCard key={referral.id} referral={referral} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada rujukan baru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
