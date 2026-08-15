import { Referral } from "@/types/api";
import { addHours, subDays } from "date-fns";

export const mockPsychologistStats = {
  pending_confirmation_count: 61,
  confirmed_schedule_count: 30,
  completed_case_count: 5,
};

export const mockReferrals: Referral[] = [
  {
    id: "ref-1",
    student_name: "Alex Allan",
    priority: "Kritis",
    status: "Menunggu Konfirmasi",
    remaining_time: "18:00:00",
    date: "05/28/2025",
    time: "10:00",
    referrer_name: "Sri Wahyuni, S.Pd, M.Pd",
    is_expired: false,
  },
  {
    id: "ref-2",
    student_name: "Dewi Ratnasari",
    priority: "Prioritas",
    status: "Menunggu Konfirmasi",
    remaining_time: "03:00:00",
    date: "05/27/2025",
    time: "10:00",
    referrer_name: "Sri Wahyuni, S.Pd, M.Pd",
    is_expired: false,
  },
  {
    id: "ref-3",
    student_name: "Ardi Putra",
    priority: "Kritis",
    status: "Menunggu Konfirmasi",
    remaining_time: "Kedaluarsa",
    date: "05/26/2025",
    time: "10:00",
    referrer_name: "Sri Wahyuni, S.Pd, M.Pd",
    is_expired: true,
  },
  {
    id: "ref-4",
    student_name: "Ardi Putra",
    priority: "Prioritas",
    status: "Terkonfirmasi",
    remaining_time: "-",
    date: "05/26/2025",
    time: "10:00",
    referrer_name: "Sri Wahyuni, S.Pd, M.Pd",
    is_expired: false,
  },
  {
    id: "ref-5",
    student_name: "Ardi Putra",
    priority: "Kritis",
    status: "Ditolak",
    remaining_time: "-",
    date: "05/26/2025",
    time: "10:00",
    referrer_name: "Sri Wahyuni, S.Pd, M.Pd",
    is_expired: false,
  },
  {
    id: "ref-6",
    student_name: "Ardi Putra",
    priority: "Prioritas",
    status: "Selesai",
    remaining_time: "-",
    date: "05/26/2025",
    time: "10:00",
    referrer_name: "Sri Wahyuni, S.Pd, M.Pd",
    is_expired: false,
  }
];
