"use client";

import { DashboardHeader } from "./DashboardHeader";
import PsychologistPanel from "./panels/PsychologistPanel";
import ReferralAlert from "./ReferralAlert";
import ReferralCard from "./ReferralCard";
import { useEffect, useState } from "react";
import { mockReferrals, mockPsychologistStats } from "@/lib/mockPsychologistData";
import { Referral } from "@/types/api";

export function PsychologistDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDashboardData = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get only the first 2 referrals that need approval for the dashboard preview
      const pendingReferrals = mockReferrals
        .filter(r => r.status === "Menunggu Konfirmasi")
        .slice(0, 2);
        
      setReferrals(pendingReferrals);
      setAlertCount(mockPsychologistStats.pending_confirmation_count);
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
