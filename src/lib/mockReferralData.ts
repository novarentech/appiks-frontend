import { Users } from "lucide-react";
import { ReferralNotification, NotificationStatus } from "@/types/notifications";

const STORAGE_KEY = "appiks_referral_mock_data";

export const getInitialMockReferrals = (): ReferralNotification[] => {
  return [
    {
      id: 1,
      type: "rujukan",
      title: "Rujukan ke Psikolog Mitra",
      description: "Rujukan konsultasi dengan psikolog mitra",
      teacher: "System",
      date: "13/05/2026",
      status: "butuh_persetujuan",
      statusText: "Butuh Persetujuan",
      statusColor: "orange",
      borderColor: "border-orange-400",
      icon: Users as any,
      isNew: true,
      hasNewTag: false,
      createdAt: "2026-05-13T14:00:00.000Z",
      psychologist: "Dr. Sarah Wijaya, M.Psi., Psikolog",
      location: "Puskesmas Kecamatan Menteng",
      counselor: "Guru BK : Sri Wahyuni, S.Pd, M.Pd",
      referralReason: "Berdasarkan asesmen, siswa memerlukan pendampingan psikolog profesional untuk menangani kecemasan akademik yang berkelanjutan.",
      referralDate: "13 Mei 2026, 14:30 WIB",
    },
    {
      id: 2,
      type: "rujukan",
      title: "Rujukan ke Psikolog Mitra",
      description: "Rujukan konsultasi dengan psikolog mitra",
      teacher: "System",
      date: "10/05/2026",
      status: "menunggu_konfirmasi",
      statusText: "Menunggu Konfirmasi",
      statusColor: "yellow",
      borderColor: "border-yellow-400",
      icon: Users as any,
      isNew: false,
      hasNewTag: false,
      createdAt: "2026-05-10T10:00:00.000Z",
      psychologist: "Dr. Budi Santoso, M.Psi., Psikolog",
      location: "Klinik Sehat Sejahtera",
      counselor: "Guru BK : Ahmad Yani, S.Pd",
      referralReason: "Siswa membutuhkan sesi lanjutan untuk evaluasi minat bakat.",
      referralDate: "10 Mei 2026, 10:00 WIB",
    },
    {
      id: 3,
      type: "rujukan",
      title: "Rujukan ke Psikolog Mitra",
      description: "Rujukan konsultasi dengan psikolog mitra",
      teacher: "System",
      date: "05/05/2026",
      status: "terkonfirmasi",
      statusText: "Terkonfirmasi",
      statusColor: "green",
      borderColor: "border-green-400",
      icon: Users as any,
      isNew: false,
      hasNewTag: false,
      createdAt: "2026-05-05T09:00:00.000Z",
      psychologist: "Dr. Lina Marlina, M.Psi., Psikolog",
      location: "RSUD Kota",
      counselor: "Guru BK : Sri Wahyuni, S.Pd, M.Pd",
      referralReason: "Sesi konseling awal menunjukkan kebutuhan pendampingan spesialis.",
      referralDate: "05 Mei 2026, 09:00 WIB",
    },
  ];
};

export const getMockReferrals = (): ReferralNotification[] => {
  if (typeof window === "undefined") return getInitialMockReferrals();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as ReferralNotification[];
      return parsed.map(item => ({ ...item, icon: Users as any }));
    } catch (e) {
      console.error("Failed to parse mock referral data", e);
    }
  }
  const initial = getInitialMockReferrals();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

export const getReferralById = (id: number): ReferralNotification | undefined => {
  const referrals = getMockReferrals();
  return referrals.find((r) => r.id === id);
};

export const updateReferralStatus = (
  id: number,
  newStatus: NotificationStatus,
  newStatusText: string,
  newStatusColor: string,
  newBorderColor: string
) => {
  if (typeof window === "undefined") return;
  const referrals = getMockReferrals();
  const index = referrals.findIndex((r) => r.id === id);
  if (index !== -1) {
    referrals[index] = {
      ...referrals[index],
      status: newStatus,
      statusText: newStatusText,
      statusColor: newStatusColor,
      borderColor: newBorderColor,
    };
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toStore = referrals.map(({ icon, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }
};
