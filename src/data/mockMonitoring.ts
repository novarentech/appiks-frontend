export interface MonitoringStat {
  title: string;
  value: number | string;
  iconType: "aktif" | "selesai" | "rujukan" | "sla";
}

export interface MonitoringTimeline {
  date: string;
  time: string;
  description: string;
  status: "success" | "pending"; // 'success' = green dot
}

export interface MonitoringCase {
  id: string;
  studentName: string;
  className: string;
  date: string;
  time: string;
  counselorName: string;
  status: "Belum Ditangani BK" | "Sedang Ditangani BK" | "Dirujuk ke Psikolog" | "Diselesaikan";
  slaStatus: "DALAM BATAS WAKTU" | "MELEBIHI BATAS WAKTU";
  timeline?: MonitoringTimeline[];
}

export const mockMonitoringStats: MonitoringStat[] = [
  { title: "TOTAL KASUS AKTIF", value: 24, iconType: "aktif" },
  { title: "INTERVENSI SELESAI", value: 27, iconType: "selesai" },
  { title: "RUJUKAN PSIKOLOG", value: 11, iconType: "rujukan" },
  { title: "PELANGGARAN SLA", value: "5 Kasus", iconType: "sla" },
];

export const mockMonitoringCases: MonitoringCase[] = [
  {
    id: "1",
    studentName: "Alex Allan",
    className: "XI IPA 1",
    date: "05/28/2025",
    time: "10:00",
    counselorName: "Sri Wahyuni, S.Pd, M.Pd",
    status: "Belum Ditangani BK",
    slaStatus: "DALAM BATAS WAKTU",
    timeline: [
      { date: "08/27/2025", time: "09.00", description: "Kasus terdeteksi oleh sistem NLP", status: "success" },
      { date: "08/27/2025", time: "09.02", description: "Notifikasi terkirim ke Guru BK & Kepala Sekolah", status: "success" },
    ]
  },
  {
    id: "2",
    studentName: "Alex Allan",
    className: "XI IPA 1",
    date: "05/28/2025",
    time: "10:00",
    counselorName: "Sri Wahyuni, S.Pd, M.Pd",
    status: "Sedang Ditangani BK",
    slaStatus: "DALAM BATAS WAKTU",
    timeline: [
      { date: "08/27/2025", time: "09.00", description: "Kasus terdeteksi oleh sistem NLP", status: "success" },
      { date: "08/27/2025", time: "09.02", description: "Notifikasi terkirim ke Guru BK & Kepala Sekolah", status: "success" },
      { date: "08/28/2025", time: "10.00", description: "Sesi konseling dimulai oleh Guru BK", status: "success" },
    ]
  },
  {
    id: "3",
    studentName: "Johnny Suh",
    className: "XI IPA 1",
    date: "05/28/2025",
    time: "10:00",
    counselorName: "Sri Wahyuni, S.Pd, M.Pd",
    status: "Belum Ditangani BK",
    slaStatus: "MELEBIHI BATAS WAKTU",
  },
  {
    id: "4",
    studentName: "Dimas Aji",
    className: "XI IPA 1",
    date: "05/28/2025",
    time: "10:00",
    counselorName: "Sri Wahyuni, S.Pd, M.Pd",
    status: "Dirujuk ke Psikolog",
    slaStatus: "MELEBIHI BATAS WAKTU",
  },
  {
    id: "5",
    studentName: "Dimas Aji",
    className: "XI IPA 1",
    date: "05/28/2025",
    time: "10:00",
    counselorName: "Sri Wahyuni, S.Pd, M.Pd",
    status: "Dirujuk ke Psikolog",
    slaStatus: "DALAM BATAS WAKTU",
  },
  {
    id: "6",
    studentName: "Anton Santoso",
    className: "XI IPA 1",
    date: "05/28/2025",
    time: "10:00",
    counselorName: "Sri Wahyuni, S.Pd, M.Pd",
    status: "Diselesaikan",
    slaStatus: "DALAM BATAS WAKTU",
  },
];
