"use client";

import { useState, useEffect } from "react";
import { Bell, X, CheckCheck, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  getAppNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  AppNotificationItem,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function HeadTeacherNotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Fetch initial unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getUnreadNotificationsCount();
        if (res.success && res.data) {
          setUnreadCount(res.data.unread_count || 0);
        }
      } catch (err) {
        console.error("Gagal memuat unread count:", err);
      }
    };

    fetchUnreadCount();
  }, []);

  // Fetch notifications list
  const fetchNotificationsList = async () => {
    setIsLoading(true);
    try {
      const res = await getAppNotifications({ per_page: 20 });
      if (res.success && res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat daftar notifikasi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationsList();
  }, []);

  // Format time display
  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).replace(".", ":");
    } catch {
      return "-";
    }
  };

  // Mark single notification as read
  const handleMarkAsRead = async (item: AppNotificationItem) => {
    if (item.read_at) return; // already read

    try {
      await markNotificationAsRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Gagal menandai notifikasi:", err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      const res = await markAllNotificationsAsRead();
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
        setUnreadCount(0);
        toast.success("Semua notifikasi ditandai sudah dibaca.");
      }
    } catch (err) {
      console.error("Gagal menandai semua dibaca:", err);
      toast.error("Gagal menandai semua notifikasi.");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const getCounselingStatusInfo = (status: string | null | undefined) => {
    if (!status) {
      return {
        label: "Belum Ditangani BK",
        style: "bg-rose-50 text-rose-600",
      };
    }

    switch (status.toLowerCase()) {
      case "menunggu":
        return {
          label: "Menunggu Tindakan",
          style: "bg-amber-50 text-amber-700",
        };
      case "menunggu_jadwal":
        return {
          label: "Menunggu Jadwal",
          style: "bg-amber-50 text-amber-700",
        };
      case "menunggu_konfirmasi":
        return {
          label: "Menunggu Konfirmasi",
          style: "bg-orange-50 text-orange-700",
        };
      case "dijadwalkan":
        return {
          label: "Dijadwalkan",
          style: "bg-emerald-50 text-emerald-700",
        };
      case "dijadwal_ulang":
        return {
          label: "Dijadwalkan Ulang",
          style: "bg-blue-50 text-blue-700",
        };
      case "menunggu_diskusi":
        return {
          label: "Menunggu Diskusi",
          style: "bg-purple-50 text-purple-700",
        };
      case "selesai":
        return {
          label: "Selesai",
          style: "bg-green-50 text-green-700",
        };
      case "ditolak":
        return {
          label: "Ditolak",
          style: "bg-rose-50 text-rose-700",
        };
      case "dibatalkan":
        return {
          label: "Dibatalkan",
          style: "bg-gray-100 text-gray-600",
        };
      default:
        return {
          label: status.replace(/_/g, " "),
          style: "bg-gray-100 text-gray-700",
        };
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifikasi Peringatan"
          className="relative flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
        >
          <Bell className="w-5 h-5 text-rose-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[340px] sm:w-[380px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white overflow-hidden z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-base">Notifikasi</h3>
            {unreadCount > 0 && (
              <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                {unreadCount} baru
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-50"
                title="Tandai semua sudah dibaca"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai dibaca</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* List Content */}
        <div className="p-4 max-h-[420px] overflow-y-auto space-y-3 divide-y divide-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-sm">Memuat notifikasi...</span>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => {
              const isUnread = item.read_at === null;
              const isRedZone =
                item.type === "RedZoneAlertNotification" ||
                item.data?.zone === "Red Zone" ||
                item.data?.level === "critical";
              const studentName = item.data?.student_name || "Siswa";
              const studentRoom = item.data?.student_room || item.data?.room || "-";
              const counselorName = item.data?.counselor_name || item.data?.assigned_counselor || "-";
              const statusInfo = getCounselingStatusInfo(
                item.data?.counseling_status ?? item.data?.status
              );
              const title = isRedZone
                ? `Peringatan Kritis / Red Zone – ${studentName}`
                : `Pemberitahuan Yellow Zone – ${studentName}`;

              return (
                <div
                  key={item.id}
                  onClick={() => handleMarkAsRead(item)}
                  className={cn(
                    "pt-3 first:pt-0 space-y-1.5 cursor-pointer rounded-xl p-2.5 transition-colors",
                    isUnread ? "bg-rose-50/40 hover:bg-rose-50/70" : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-gray-800 text-sm leading-snug">
                      {title}
                    </h4>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    )}
                  </div>

                  <p className="text-xs text-gray-600">
                    Kelas : <span className="font-medium text-gray-800">{studentRoom}</span>
                  </p>

                  <p className="text-xs text-gray-600">
                    Guru BK : <span className="font-medium text-gray-800">{counselorName}</span>
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span>Status :</span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-medium",
                        statusInfo.style
                      )}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider",
                        isRedZone
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-800"
                      )}
                    >
                      {item.data?.zone || (isRedZone ? "Red Zone" : "Yellow Zone")}
                    </span>

                    <span className="text-[11px] text-gray-400">
                      {formatTime(item.data?.time || item.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              Tidak ada notifikasi
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
