import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, User, ChevronRight, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { MonitoringCaseItem, SharingTimelineEvent } from "@/types/api";
import { markNotificationAsRead, getSharingTimeline } from "@/lib/api";

interface MonitoringCaseCardProps {
  item: MonitoringCaseItem;
  onCaseMarked?: (id: string | number) => void;
}

export function MonitoringCaseCard({ item, onCaseMarked }: MonitoringCaseCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMarked, setIsMarked] = useState(item.marked ?? false);
  const [timelineEvents, setTimelineEvents] = useState<SharingTimelineEvent[]>([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

  useEffect(() => {
    setIsMarked(item.marked ?? false);
  }, [item.marked]);

  const handleOpenDetail = async (open: boolean) => {
    setIsDetailOpen(open);
    if (open) {
      if (!isMarked) {
        setIsMarked(true);
        if (item.notification_id) {
          markNotificationAsRead(item.notification_id).catch((err) =>
            console.error("Gagal menandai notifikasi:", err)
          );
        }
        onCaseMarked?.(item.id);
      }

      // Fetch dynamic timeline events
      setIsLoadingTimeline(true);
      try {
        const res = await getSharingTimeline(item.id);
        if (res.success && res.data?.events && Array.isArray(res.data.events)) {
          const sorted = [...res.data.events].sort(
            (a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
          );
          setTimelineEvents(sorted);
        } else {
          setTimelineEvents([]);
        }
      } catch (err) {
        console.error("Gagal memuat timeline sharing:", err);
      } finally {
        setIsLoadingTimeline(false);
      }
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Belum Ditangani BK":
      case "Belum Ditinjau":
        return "bg-red-50 text-red-600";
      case "Sedang Ditangani BK":
      case "Sedang Ditangani":
        return "bg-cyan-50 text-cyan-600";
      case "Menunggu Persetujuan Siswa":
        return "bg-amber-50 text-amber-600";
      case "Konseling Dijadwalkan":
        return "bg-purple-50 text-purple-600";
      case "Dirujuk ke Psikolog":
        return "bg-blue-50 text-blue-600";
      case "Diselesaikan":
      case "Selesai":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getSlaBadge = (slaStatus: string) => {
    if (slaStatus === "DALAM BATAS WAKTU") {
      return (
        <span className="flex items-center text-xs font-semibold text-green-600 tracking-wider">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {slaStatus}
        </span>
      );
    }
    return (
      <span className="flex items-center text-xs font-semibold text-red-500 tracking-wider">
        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
        {slaStatus}
      </span>
    );
  };

  const formatTimelineDate = (dateStr?: string) => {
    if (!dateStr) return { date: "-", time: "-" };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { date: "-", time: "-" };
      return {
        date: d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }).replace(".", ":"),
      };
    } catch {
      return { date: "-", time: "-" };
    }
  };

  const getStageBadgeStyle = (stage: string, event: string) => {
    if (event === "sla_deadline_elapsed") {
      return {
        dot: "bg-rose-500",
        badge: "bg-rose-50 text-rose-700 border-rose-200",
      };
    }
    switch (stage?.toLowerCase()) {
      case "triage":
        return {
          dot: "bg-amber-500",
          badge: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "konseling":
        return {
          dot: "bg-sky-500",
          badge: "bg-sky-50 text-sky-700 border-sky-200",
        };
      case "rujukan":
        return {
          dot: "bg-indigo-500",
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      default:
        return {
          dot: "bg-green-500",
          badge: "bg-green-50 text-green-700 border-green-200",
        };
    }
  };

  const renderPayloadInfo = (payload: any) => {
    if (!payload || typeof payload !== "object") return null;
    const items: string[] = [];
    if (payload.action) items.push(`Tindakan: ${payload.action.replace(/_/g, " ")}`);
    if (payload.type) items.push(`Tipe: ${payload.type}`);
    if (payload.zone) items.push(`Zona: ${payload.zone}`);
    if (payload.priority) items.push(`Prioritas: ${payload.priority}`);
    if (payload.slot_date && payload.slot_time) items.push(`Jadwal: ${payload.slot_date} ${payload.slot_time}`);
    else if (payload.scheduled_at) {
      const d = new Date(payload.scheduled_at);
      if (!isNaN(d.getTime())) {
        items.push(`Jadwal: ${d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`);
      }
    }
    if (items.length === 0) return null;
    return (
      <p className="text-xs text-gray-500 mt-0.5">
        {items.join(" • ")}
      </p>
    );
  };

  return (
    <Card className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Top Row: Name and Status */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-lg">{item.studentName}</h3>
            {!isMarked && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 animate-pulse">
                Baru
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{item.className}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className={`border-0 px-3 py-1 text-xs font-medium ${getStatusStyle(item.status)}`}>
            {item.status}
          </Badge>
          {getSlaBadge(item.slaStatus)}
        </div>
      </div>

      {/* Bottom Row: Details and Link */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-100">
            <Calendar className="w-3.5 h-3.5" />
            {item.date}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-100">
            <Clock className="w-3.5 h-3.5" />
            {item.time}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-100">
            <User className="w-3.5 h-3.5" />
            Guru BK : {item.counselorName}
          </div>
        </div>
        
        <Dialog open={isDetailOpen} onOpenChange={handleOpenDetail}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 mt-2">
              Lihat Detail
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Ringkasan Penanganan Kasus</DialogTitle>
              <DialogDescription className="text-gray-500">
                Informasi ditampilkan terbatas untuk menjaga privasi siswa
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-gray-50 rounded-xl p-5 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Nama Siswa</p>
                <p className="font-bold text-gray-900">{item.studentName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Kelas</p>
                <p className="font-bold text-gray-900">{item.className}</p>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-sm font-medium text-gray-500">Tanggal Trigger</p>
                <p className="font-bold text-gray-900">{item.date} {item.time}</p>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className={`border-0 px-2 py-0.5 text-xs font-medium ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </Badge>
                  {getSlaBadge(item.slaStatus)}
                </div>
              </div>
              <div className="space-y-1 mt-2 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Guru BK PIC</p>
                <p className="font-bold text-gray-900">{item.counselorName}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Timeline Penanganan</h4>
              
              {isLoadingTimeline ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span className="text-sm">Memuat jejak penanganan...</span>
                </div>
              ) : timelineEvents.length > 0 ? (
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-2 max-h-[320px] overflow-y-auto pr-2">
                  {timelineEvents.map((step) => {
                    const { date, time } = formatTimelineDate(step.occurred_at);
                    const { dot, badge } = getStageBadgeStyle(step.stage, step.event);
                    return (
                      <div key={step.id} className="relative pl-6">
                        <div
                          className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full ${dot} shadow-sm border-2 border-white`}
                        />
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">
                              {date} {time}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${badge}`}
                            >
                              {step.stage}
                            </span>
                            {step.is_system && (
                              <span className="text-[10px] text-gray-400 font-medium">
                                (Sistem)
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {step.label}
                          </span>
                          {renderPayloadInfo(step.payload)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : item.timeline && item.timeline.length > 0 ? (
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-2">
                  {item.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-sm font-medium text-gray-500">{step.date} {step.time}</span>
                        <span className="text-sm text-gray-700">{step.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic pl-6">Belum ada jejak penanganan kasus.</p>
              )}
            </div>

            <div className="mt-6 pt-4">
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-6 rounded-xl text-lg font-semibold" onClick={() => setIsDetailOpen(false)}>
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
