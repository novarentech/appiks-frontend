"use client";

import { DashboardHeader } from "./DashboardHeader";
import PsychologistPanel from "./panels/PsychologistPanel";
import ReferralAlert from "./ReferralAlert";
import ReferralCard from "./ReferralCard";
import { useEffect, useState } from "react";
import { Referral } from "@/types/api";
import { getPsychologistReferrals, getReferralOverview } from "@/lib/api";

export function PsychologistDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [alertCount, setAlertCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getPsychologistReferrals({
          page: 1,
          limit: 50,
          status: "pending",
        });
        if (response.success && response.data) {
          const mappedReferrals: Referral[] = response.data.data.map((item) => {
            const deadline = new Date(item.deadline_at);
            const now = new Date();
            const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

            let priority = "Prioritas";
            const sharingPriority = (item.counseling as any)?.sharing?.priority?.toLowerCase() || "";
            if (["sedang", "berat", "tinggi", "kritis"].includes(sharingPriority)) {
              priority = "Kritis";
            }

            const status = item.status || "pending";

            let remainingTimeStr = "";
            const isExpired = item.is_expired !== undefined ? item.is_expired : (status?.toLowerCase() === "expired" || diffHours <= 0);
            if (!isExpired && diffHours > 0) {
              const diffDays = Math.floor(diffHours / 24);
              const remainingHours = Math.floor(diffHours % 24);
              remainingTimeStr = `${diffDays} hari ${remainingHours} jam`;
            }

            return {
              id: item.id.toString(),
              counseling_id: item.counseling_id?.toString() || item.counseling?.id?.toString(),
              student_name: item.student?.name || "Tanpa Nama",
              priority,
              status,
              remaining_time: remainingTimeStr,
              date: item.slot?.slot_date
                ? new Date(item.slot.slot_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-",
              time: item.slot
                ? `${item.slot.slot_start_time.slice(0, 5)} - ${item.slot.slot_end_time.slice(0, 5)}`
                : "-",
              referrer_name: item.counseling?.counselor?.name || "Guru BK",
              counselor_notes: item.counseling?.notes || "-",
              submitted_at: new Date(item.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              is_expired: isExpired,
            };
          });

          // Hanya menampilkan rujukan kritis dengan status Menunggu Konfirmasi
          const criticalPendingReferrals = mappedReferrals.filter(
            (r) =>
              r.priority === "Kritis" &&
              (r.status?.toLowerCase() === "pending" ||
                r.status?.toLowerCase() === "menunggu" ||
                r.status === "Menunggu Konfirmasi")
          );

          setReferrals(criticalPendingReferrals);
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    const fetchOverview = async () => {
      try {
        const response = await getReferralOverview();
        if (response.success && response.data) {
          setAlertCount(response.data.pending);
        }
      } catch (error) {
        console.error("Error fetching overview:", error);
      }
    };

    fetchDashboardData();
    fetchOverview();
  }, [refreshKey]);

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
          <h2 className="text-xl font-bold">Referral Kritis Masuk</h2>
          <p className="text-gray-500 text-sm mt-1">
            Rujukan siswa prioritas kritis dari Guru BK yang menunggu konfirmasi jadwal
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          {referrals.length > 0 ? (
            referrals.map((referral) => (
              <ReferralCard 
                key={referral.id} 
                referral={referral} 
                onActionSuccess={() => setRefreshKey(prev => prev + 1)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada rujukan kritis yang menunggu konfirmasi saat ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
