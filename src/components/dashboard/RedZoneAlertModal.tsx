"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  getAppNotifications,
  markNotificationAsRead,
  AppNotificationItem,
} from "@/lib/api";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function RedZoneAlertModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await getAppNotifications({
          unread: "true",
          class: "RedZoneAlertNotification",
          per_page: 50,
        });
        if (res.success && res.data && Array.isArray(res.data)) {
          const redZoneNotifs = res.data.filter(
            (n) => n.type === "RedZoneAlertNotification" || n.data?.zone === "Red Zone"
          );
          if (redZoneNotifs.length > 0) {
            setNotifications(redZoneNotifs);
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch red zone notifications:", err);
      }
    };
    fetchIncidents();
  }, []);

  const currentNotification = notifications[0];

  const handleCloseCurrent = async () => {
    if (currentNotification) {
      try {
        await markNotificationAsRead(currentNotification.id);
      } catch (err) {
        console.error("Gagal menandai notifikasi sebagai dibaca:", err);
      }
    }
    if (notifications.length > 1) {
      setNotifications((prev) => prev.slice(1));
    } else {
      setIsOpen(false);
    }
  };

  const handleViewDetail = async () => {
    if (currentNotification) {
      try {
        await markNotificationAsRead(currentNotification.id);
      } catch (err) {
        console.error("Gagal menandai notifikasi sebagai dibaca:", err);
      }
    }
    setIsOpen(false);
    router.push("/dashboard/monitoring-penanganan");
  };

  if (!isOpen || !currentNotification) return null;

  const data = currentNotification.data || {};
  const studentName = data.student_name || "Siswa";
  const message = data.message || "Peringatan Red Zone terdeteksi.";
  const time = data.time || data.created_at || currentNotification.created_at;

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "-";
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return timeStr;
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeStr;
    }
  };

  const studentRoom = data.student_room || data.room || "-";
  const counselorName = data.counselor_name || data.assigned_counselor || "-";

  const getCounselingStatusInfo = (status: string | null | undefined) => {
    if (!status) {
      return {
        label: "Belum Ditangani BK",
        style: "bg-rose-50 text-rose-600 border-rose-200",
      };
    }

    switch (status.toLowerCase()) {
      case "menunggu":
        return {
          label: "Menunggu Tindakan",
          style: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "menunggu_jadwal":
        return {
          label: "Menunggu Jadwal",
          style: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "menunggu_konfirmasi":
        return {
          label: "Menunggu Konfirmasi",
          style: "bg-orange-50 text-orange-700 border-orange-200",
        };
      case "dijadwalkan":
        return {
          label: "Dijadwalkan",
          style: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "dijadwal_ulang":
        return {
          label: "Dijadwalkan Ulang",
          style: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "menunggu_diskusi":
        return {
          label: "Menunggu Diskusi",
          style: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "selesai":
        return {
          label: "Selesai",
          style: "bg-green-50 text-green-700 border-green-200",
        };
      case "ditolak":
        return {
          label: "Ditolak",
          style: "bg-rose-50 text-rose-700 border-rose-200",
        };
      case "dibatalkan":
        return {
          label: "Dibatalkan",
          style: "bg-gray-100 text-gray-600 border-gray-200",
        };
      default:
        return {
          label: status.replace(/_/g, " "),
          style: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  const statusInfo = getCounselingStatusInfo(data.counseling_status ?? data.status);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 border-none rounded-2xl overflow-hidden shadow-2xl [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Kasus Baru Terdeteksi</DialogTitle>
        </VisuallyHidden>
        <div className="bg-white">
          <div className="p-6 pb-2 relative">
            <button 
              onClick={handleCloseCurrent}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold text-gray-500">Kasus Baru Terdeteksi</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 ml-7">Red Zone Alert</h2>
          </div>

          <div className="px-6 py-4">
            <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {studentName}
                </h3>
                <Badge variant="outline" className="px-2 py-0 text-[10px] uppercase font-bold tracking-wider rounded bg-red-50 text-red-600 border-red-200">
                  {data.level === "critical" ? "Kritis" : "Red Zone"}
                </Badge>
              </div>
              
              <div className="space-y-2.5 text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-24">Kelas</span>
                  <span className="font-medium text-gray-900">: {studentRoom}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24">Guru BK</span>
                  <span className="font-medium text-gray-900">: {counselorName}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-24">Status</span>
                  <span className="font-medium mr-1">:</span>
                  <Badge variant="outline" className={`font-medium border ${statusInfo.style}`}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24">Keterangan</span>
                  <span className="font-medium text-gray-900">: {message}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-24">Waktu</span>
                  <span className="font-medium text-gray-900">: {formatTime(time)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-2 flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCloseCurrent}
              className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold focus:ring-0"
            >
              Tutup {notifications.length > 1 ? `(Tersisa ${notifications.length - 1})` : ""}
            </Button>
            <Button 
              onClick={handleViewDetail}
              className="flex-1 bg-[#e53e51] hover:bg-red-700 text-white font-semibold focus:ring-0"
            >
              Lihat Detail
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
