"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  getCounselingConsent,
  getPsychologistMoodRecap,
  getPsychologistSharingRecap,
  getPsychologistCounselingRecap,
} from "@/lib/api";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import MoodChart from "@/components/dashboard/MoodChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  Smile,
  MessageCircle,
  Calendar,
  HandHeart,
  ChevronLeft,
  Eye,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { format } from "date-fns";

type TabType = "mood" | "curhat" | "konseling";

export default function StudentDataSharedDetailPage() {
  return (
    <RoleGuard permissionType="student-data">
      <StudentDataSharedDetailContent />
    </RoleGuard>
  );
}

function StudentDataSharedDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const counselingId = params.id as string;
  const nameQuery = searchParams.get("name");

  const [activeTab, setActiveTab] = useState<TabType>("mood");

  // Consent states
  const [consentData, setConsentData] = useState<any | null>(null);
  const [loadingConsent, setLoadingConsent] = useState<boolean>(true);

  // Student name (fallback or resolved from query param / API)
  const [studentName, setStudentName] = useState<string>(nameQuery || "Siswa");

  useEffect(() => {
    if (nameQuery) {
      setStudentName(nameQuery);
    }
  }, [nameQuery]);

  // Tab 1: Mood States
  const [moodData, setMoodData] = useState<any | null>(null);
  const [loadingMood, setLoadingMood] = useState<boolean>(false);
  const [errorMood, setErrorMood] = useState<string | null>(null);

  // Tab 2: Sharing (Curhat) States
  const [sharingData, setSharingData] = useState<any | null>(null);
  const [loadingSharing, setLoadingSharing] = useState<boolean>(false);
  const [errorSharing, setErrorSharing] = useState<string | null>(null);
  const [currentPageSharing, setCurrentPageSharing] = useState<number>(1);
  const itemsPerPageSharing = 8;
  const [sortOrderSharing, setSortOrderSharing] = useState<"asc" | "desc">("desc");
  const [selectedSharing, setSelectedSharing] = useState<any | null>(null);

  // Tab 3: Counseling (Asesmen) States
  const [counselingData, setCounselingData] = useState<any | null>(null);
  const [loadingCounseling, setLoadingCounseling] = useState<boolean>(false);
  const [errorCounseling, setErrorCounseling] = useState<string | null>(null);
  const [currentPageCounseling, setCurrentPageCounseling] = useState<number>(1);
  const itemsPerPageCounseling = 8;
  const [sortOrderCounseling, setSortOrderCounseling] = useState<"asc" | "desc">("desc");
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

  // 1. Fetch Consent
  const fetchConsent = useCallback(async () => {
    if (!counselingId) return;
    try {
      setLoadingConsent(true);
      const res = await getCounselingConsent(Number(counselingId));
      if (res?.success && res.data) {
        setConsentData(res.data);
        if (res.data.counseling?.student?.name) {
          setStudentName(res.data.counseling.student.name);
        }
      } else {
        setConsentData(null);
      }
    } catch (err: any) {
      console.error("Error fetching consent:", err);
      setConsentData(null);
    } finally {
      setLoadingConsent(false);
    }
  }, [counselingId]);

  useEffect(() => {
    fetchConsent();
  }, [fetchConsent]);

  // Check consent scopes & status
  // Backend returns: status: "granted", rejected_at: null, scopes: [...]
  const isConsentGranted =
    consentData?.status === "granted" &&
    !consentData?.rejected_at;
  const scopes: string[] = consentData?.scopes || [];

  const isConsentRevoked =
    !loadingConsent &&
    (!isConsentGranted ||
      consentData?.status === "revoked" ||
      consentData?.status === "menunggu_diskusi" ||
      Boolean(consentData?.rejected_at) ||
      consentData?.counseling?.status === "menunggu_diskusi");

  const hasMoodConsent = isConsentGranted && scopes.includes("mood_history");
  const hasSharingConsent = isConsentGranted && scopes.includes("sharing_history");
  const hasCounselingConsent = isConsentGranted && scopes.includes("assesment_logs");

  // 2. Fetch Tab 1: Mood Data
  const fetchMoodData = useCallback(async () => {
    if (!counselingId || !hasMoodConsent) return;
    try {
      setLoadingMood(true);
      setErrorMood(null);
      const response = await getPsychologistMoodRecap(counselingId);
      if (response?.success && response.data) {
        setMoodData(response.data);
        if (response.data.student?.name) {
          setStudentName(response.data.student.name);
        }
      } else {
        setErrorMood(response?.message || "Gagal memuat data mood.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMood("Terjadi kesalahan saat mengambil data mood.");
    } finally {
      setLoadingMood(false);
    }
  }, [counselingId, hasMoodConsent]);

  // 3. Fetch Tab 2: Sharing Data
  const fetchSharingData = useCallback(async () => {
    if (!counselingId || !hasSharingConsent) return;
    try {
      setLoadingSharing(true);
      setErrorSharing(null);
      const response = await getPsychologistSharingRecap(counselingId);
      if (response?.success && response.data) {
        setSharingData(response.data);
        if (response.data.student?.name) {
          setStudentName(response.data.student.name);
        }
      } else {
        setErrorSharing(response?.message || "Gagal memuat riwayat curhat.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorSharing("Terjadi kesalahan saat mengambil riwayat curhat.");
    } finally {
      setLoadingSharing(false);
    }
  }, [counselingId, hasSharingConsent]);

  // 4. Fetch Tab 3: Counseling Data
  const fetchCounselingData = useCallback(async () => {
    if (!counselingId || !hasCounselingConsent) return;
    try {
      setLoadingCounseling(true);
      setErrorCounseling(null);
      const response = await getPsychologistCounselingRecap(counselingId);
      if (response?.success && response.data) {
        setCounselingData(response.data);
        if (response.data.student?.name) {
          setStudentName(response.data.student.name);
        }
      } else {
        setErrorCounseling(response?.message || "Gagal memuat catatan konseling.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorCounseling("Terjadi kesalahan saat mengambil catatan konseling.");
    } finally {
      setLoadingCounseling(false);
    }
  }, [counselingId, hasCounselingConsent]);

  // Load data based on active tab and consent
  useEffect(() => {
    if (activeTab === "mood" && hasMoodConsent && !moodData) {
      fetchMoodData();
    } else if (activeTab === "curhat" && hasSharingConsent && !sharingData) {
      fetchSharingData();
    } else if (activeTab === "konseling" && hasCounselingConsent && !counselingData) {
      fetchCounselingData();
    }
  }, [
    activeTab,
    hasMoodConsent,
    hasSharingConsent,
    hasCounselingConsent,
    moodData,
    sharingData,
    counselingData,
    fetchMoodData,
    fetchSharingData,
    fetchCounselingData,
  ]);

  // Mood analysis logic
  const getMoodAnalysis = () => {
    const mean = moodData?.mean || "neutral";
    if (mean === "insecure" || mean === "sad" || mean === "angry") {
      return {
        trend: "tidak aman",
        description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori tidak aman dalam periode terakhir. Hal ini dapat menjadi tanda bahwa siswa sedang mengalami tekanan emosional atau perasaan negatif yang cukup sering. Disarankan untuk menghubungi siswa secara personal, menawarkan sesi konseling secara private, atau memantau perubahan mood di minggu berikutnya.`,
      };
    } else {
      return {
        trend: "aman",
        description: `Mood rata-rata siswa ${studentName} tercatat berada di kategori aman dalam periode terakhir. Hal ini menunjukkan bahwa siswa memiliki kondisi emosional yang stabil. Tetap pantau perkembangan mood siswa untuk memastikan kondisinya tetap baik.`,
      };
    }
  };

  const currentMoodStats = moodData?.recap || {
    sad: 0,
    neutral: 0,
    angry: 0,
    happy: 0,
  };

  // Render Revoked / No Consent State (Gambar 2)
  const renderRevokedState = () => (
    <div className="border border-gray-200 rounded-2xl p-16 sm:p-24 flex flex-col items-center justify-center text-center bg-white min-h-[380px]">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-500">
        <HandHeart className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
        Siswa Memilih Tidak Melanjutkan Rujukan
      </h3>
      <p className="text-gray-500 text-xs sm:text-sm max-w-xl leading-relaxed">
        Siswa telah mencabut persetujuannya untuk sesi konseling dengan psikolog.
        Mencabut persetujuan adalah hak siswa sepenuhnya dan tidak mencerminkan
        penilaian negatif terhadap layanan ini.
      </p>
    </div>
  );

  // Render Mood Tab Content (Gambar 1)
  const renderMoodContent = () => {
    if (!hasMoodConsent) {
      return renderRevokedState();
    }

    if (loadingMood) {
      return (
        <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-500 text-sm">Memuat data mood...</p>
        </div>
      );
    }

    if (errorMood) {
      return (
        <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-gray-100">
          <p className="text-red-500 mb-3 text-sm">{errorMood}</p>
          <Button variant="outline" size="sm" onClick={fetchMoodData}>
            Coba Lagi
          </Button>
        </div>
      );
    }

    return (
      <div>
        <MoodChart
          title={`Lihat Pola Mood ${studentName}`}
          subtitle="Laporan Pola Mood"
          selectedPeriod="30"
          moodData={moodData?.moods || []}
          currentMoodStats={currentMoodStats}
          moodAnalysis={getMoodAnalysis()}
          onPeriodChange={() => {}}
          showDownloadButton={false}
          hidePeriodSelector={true}
          hideHeader={true}
        />
      </div>
    );
  };

  // Render Curhat Tab Content
  const renderCurhatContent = () => {
    if (!hasSharingConsent) {
      return renderRevokedState();
    }

    if (loadingSharing) {
      return (
        <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-500 text-sm">Memuat riwayat curhat...</p>
        </div>
      );
    }

    if (errorSharing) {
      return (
        <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-gray-100">
          <p className="text-red-500 mb-3 text-sm">{errorSharing}</p>
          <Button variant="outline" size="sm" onClick={fetchSharingData}>
            Coba Lagi
          </Button>
        </div>
      );
    }

    const sharings = sharingData?.sharings || [];
    const sortedSharings = [...sharings].sort((a: any, b: any) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrderSharing === "asc" ? dateA - dateB : dateB - dateA;
    });

    const totalPages = Math.ceil(sortedSharings.length / itemsPerPageSharing);
    const currentItems = sortedSharings.slice(
      (currentPageSharing - 1) * itemsPerPageSharing,
      currentPageSharing * itemsPerPageSharing,
    );

    const getZoneBadgeVariant = (zone: string) => {
      if (zone === "Red Zone") return "bg-red-50 text-red-500 border-red-100";
      if (zone === "Yellow Zone")
        return "bg-orange-50 text-orange-500 border-orange-100";
      return "bg-green-50 text-green-500 border-green-100";
    };

    const getZoneLabel = (zone: string) => {
      if (zone === "Red Zone") return "Kritis";
      if (zone === "Yellow Zone") return "Prioritas";
      return "Aman";
    };

    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-indigo-50/50">
              <TableRow className="border-b-indigo-100/50">
                <TableHead
                  className="text-indigo-800 font-semibold h-12 cursor-pointer hover:bg-indigo-100/50 transition-colors select-none w-[200px]"
                  onClick={() => {
                    setSortOrderSharing((prev) =>
                      prev === "asc" ? "desc" : "asc",
                    );
                    setCurrentPageSharing(1);
                  }}
                >
                  Waktu Dibuat{" "}
                  <ChevronLeft
                    className={`w-3 h-3 inline opacity-50 transition-transform ml-1 ${
                      sortOrderSharing === "asc" ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </TableHead>
                <TableHead className="text-indigo-800 font-semibold h-12">
                  Zona Risiko
                </TableHead>
                <TableHead className="text-indigo-800 font-semibold h-12">
                  Transkrip Curhatan
                </TableHead>
                <TableHead className="text-indigo-800 font-semibold h-12">
                  Kata Kunci
                </TableHead>
                <TableHead className="text-indigo-800 font-semibold h-12 text-right pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item: any) => {
                  const zone = item.nlp?.response?.zone_status || "No Trigger";
                  const keywords =
                    item.nlp?.response?.matched_keywords?.map((k: any) =>
                      typeof k === "string" ? k : k.stem,
                    ) || [];
                  const dateFormatted = format(
                    new Date(item.created_at),
                    "MM/dd/yyyy hh:mm a",
                  );

                  return (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors border-b-gray-100"
                    >
                      <TableCell className="font-medium text-gray-600 py-4 w-[180px]">
                        {dateFormatted}
                      </TableCell>
                      <TableCell className="py-4 w-[120px]">
                        <Badge
                          variant="outline"
                          className={`${getZoneBadgeVariant(
                            zone,
                          )} font-normal px-3 py-0.5`}
                        >
                          {getZoneLabel(zone)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 py-4 max-w-[300px]">
                        <p className="truncate">{item.description}</p>
                      </TableCell>
                      <TableCell className="py-4 max-w-[250px]">
                        <div className="flex flex-wrap gap-1.5">
                          {keywords.length > 0 ? (
                            keywords.map((kw: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-red-50 text-red-400 border-red-100 font-normal px-2 text-[11px] whitespace-nowrap"
                              >
                                {kw}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6 w-[100px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-2 h-8"
                          onClick={() => setSelectedSharing(item)}
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          Lihat
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-gray-500"
                  >
                    Tidak ada data riwayat curhat
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {sharings.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
              <span className="text-sm text-gray-500 font-medium">
                Halaman {currentPageSharing} dari {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPageSharing((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPageSharing === 1}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium h-9 px-4"
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    setCurrentPageSharing((prev) =>
                      Math.min(totalPages, prev + 1),
                    )
                  }
                  disabled={currentPageSharing >= totalPages}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium h-9 px-6"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}

          {/* Modal Detail Curhat */}
          <Dialog
            open={!!selectedSharing}
            onOpenChange={(open) => !open && setSelectedSharing(null)}
          >
            <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0 pb-4 border-b">
                <DialogTitle>Transkrip Curhatan</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                    {selectedSharing?.description}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 pt-4 border-t flex justify-end">
                <Button
                  onClick={() => setSelectedSharing(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Tutup
                </Button>
              </div>
            </DialogContent>
          </Dialog>
      </div>
    );
  };

  // Render Konseling Tab Content
  const renderKonselingContent = () => {
    if (!hasCounselingConsent) {
      return renderRevokedState();
    }

    if (loadingCounseling) {
      return (
        <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-500 text-sm">Memuat catatan konseling...</p>
        </div>
      );
    }

    if (errorCounseling) {
      return (
        <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-gray-100">
          <p className="text-red-500 mb-3 text-sm">{errorCounseling}</p>
          <Button variant="outline" size="sm" onClick={fetchCounselingData}>
            Coba Lagi
          </Button>
        </div>
      );
    }

    const assessments =
      counselingData?.counselings ||
      counselingData?.assessments ||
      counselingData?.records ||
      [];

    const getNotes = (item: any) => {
      if (item.clinical_notes) return item.clinical_notes;
      if (item.notes) return item.notes;
      if (item.assessment) return item.assessment;
      if (item.counseling_notes) return item.counseling_notes;
      if (item.summary) return item.summary;
      return "-";
    };

    const sortedAssessments = [...assessments].sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || a.scheduled_at || 0).getTime();
      const dateB = new Date(b.created_at || b.scheduled_at || 0).getTime();
      return sortOrderCounseling === "asc" ? dateA - dateB : dateB - dateA;
    });

    const totalPages = Math.ceil(
      sortedAssessments.length / itemsPerPageCounseling,
    );
    const currentItems = sortedAssessments.slice(
      (currentPageCounseling - 1) * itemsPerPageCounseling,
      currentPageCounseling * itemsPerPageCounseling,
    );

    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-indigo-50/50">
              <TableRow className="border-b-indigo-100/50">
                <TableHead
                  className="text-indigo-800 font-semibold h-12 cursor-pointer hover:bg-indigo-100/50 transition-colors select-none w-[200px]"
                  onClick={() => {
                    setSortOrderCounseling((prev) =>
                      prev === "asc" ? "desc" : "asc",
                    );
                    setCurrentPageCounseling(1);
                  }}
                >
                  Waktu Sesi{" "}
                  <ChevronLeft
                    className={`w-3 h-3 inline opacity-50 transition-transform ml-1 ${
                      sortOrderCounseling === "asc" ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </TableHead>
                <TableHead className="text-indigo-800 font-semibold h-12">
                  Guru BK
                </TableHead>
                <TableHead className="text-indigo-800 font-semibold h-12">
                  Metode Konseling
                </TableHead>
                <TableHead className="text-indigo-800 font-semibold h-12">
                  Catatan Asesmen
                </TableHead>
                <TableHead className="text-indigo-800 font-semibold h-12 text-right pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item: any, idx: number) => {
                  const dateRaw =
                    item.created_at || item.scheduled_at || item.date;
                  const dateFormatted = dateRaw
                    ? format(new Date(dateRaw), "MM/dd/yyyy hh:mm a")
                    : "-";
                  const counselorName =
                    item.counselor?.name || item.guru_bk || "Guru BK";
                  const method = item.method || item.session_mode || "-";
                  const notes = getNotes(item);

                  return (
                    <TableRow
                      key={item.id || idx}
                      className="hover:bg-gray-50/50 transition-colors border-b-gray-100"
                    >
                      <TableCell className="font-medium text-gray-600 py-4 w-[180px]">
                        {dateFormatted}
                      </TableCell>
                      <TableCell className="py-4 text-gray-800 font-medium">
                        {counselorName}
                      </TableCell>
                      <TableCell className="py-4 text-gray-600">
                        <span className="capitalize">{method}</span>
                      </TableCell>
                      <TableCell className="text-gray-500 py-4 max-w-[350px]">
                        <p className="truncate">{notes}</p>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6 w-[100px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-2 h-8"
                          onClick={() => setSelectedAssessment(item)}
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          Lihat
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-gray-500"
                  >
                    Tidak ada catatan asesmen dari Guru BK
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {assessments.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
              <span className="text-sm text-gray-500 font-medium">
                Halaman {currentPageCounseling} dari {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPageCounseling((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPageCounseling === 1}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium h-9 px-4"
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    setCurrentPageCounseling((prev) =>
                      Math.min(totalPages, prev + 1),
                    )
                  }
                  disabled={currentPageCounseling >= totalPages}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium h-9 px-6"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}

          {/* Modal Detail Asesmen */}
          <Dialog
            open={!!selectedAssessment}
            onOpenChange={(open) => !open && setSelectedAssessment(null)}
          >
            <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-600" />
                  <DialogTitle>Detail Catatan Asesmen</DialogTitle>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Guru BK</div>
                      <div className="font-semibold text-gray-900">
                        {selectedAssessment?.counselor?.name ||
                          selectedAssessment?.guru_bk ||
                          "Guru BK"}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        Metode Konseling
                      </div>
                      <div className="font-semibold text-gray-900 capitalize">
                        {selectedAssessment?.method ||
                          selectedAssessment?.session_mode ||
                          "-"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-base text-gray-900 mb-2">
                      Catatan Hasil Konseling
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                      {selectedAssessment ? getNotes(selectedAssessment) : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 border-t flex justify-end">
                <Button
                  onClick={() => setSelectedAssessment(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Tutup
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Alert Banner: Persetujuan Dicabut Siswa */}
      {isConsentRevoked && (
        <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-purple-950">
                  Persetujuan Akses Data Dicabut Siswa
                </h3>
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-700 border-purple-300 text-xs font-medium"
                >
                  Menunggu Diskusi
                </Badge>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed max-w-2xl">
                <span className="font-semibold">{studentName}</span> telah
                mencabut persetujuan akses data. Silakan segera menindaklanjuti
                dengan dialog bersama siswa untuk memahami kendala atau
                kekhawatirannya.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-xs rounded-xl flex-shrink-0 text-sm font-medium px-4 h-10 w-full sm:w-auto"
          >
            <Link
              href={`/dashboard/counseling-schedule?search=${encodeURIComponent(
                studentName
              )}`}
            >
              Jadwalkan Sesi Dialog
            </Link>
          </Button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-6 sm:gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("mood")}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "mood"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Smile className="w-4 h-4" />
          Riwayat Mood
        </button>
        <button
          onClick={() => setActiveTab("curhat")}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "curhat"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Riwayat Curhat
        </button>
        <button
          onClick={() => setActiveTab("konseling")}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "konseling"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Riwayat Konseling
        </button>
      </div>

      {/* Header Title & Subtitle - Seragam untuk semua Tab */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {activeTab === "mood"
            ? `Lihat Pola Mood ${studentName}`
            : activeTab === "curhat"
            ? `Riwayat Curhat ${studentName}`
            : `Riwayat Konseling ${studentName}`}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {activeTab === "mood"
            ? "Laporan Pola Mood"
            : activeTab === "curhat"
            ? `Riwayat Curhat ${studentName} dalam 30 hari`
            : "Catatan Asesmen & Sesi Konseling Guru BK"}
        </p>
      </div>

      {/* Main Content per Active Tab */}
      {loadingConsent ? (
        <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-500 text-sm">Memeriksa izin data siswa...</p>
        </div>
      ) : (
        <>
          {activeTab === "mood" && renderMoodContent()}
          {activeTab === "curhat" && renderCurhatContent()}
          {activeTab === "konseling" && renderKonselingContent()}
        </>
      )}
    </div>
  );
}
