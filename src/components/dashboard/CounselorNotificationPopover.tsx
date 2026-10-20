"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, CheckCheck, Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
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

export function CounselorNotificationPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Fetch initial unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getUnreadNotificationsCount({
          class: "ConsentRevokedNotification",
        });
        if (res.success && res.data) {
          setUnreadCount(res.data.unread_count || 0);
        }
      } catch (err) {
        console.error("Gagal memuat unread count Guru BK:", err);
      }
    };

    fetchUnreadCount();
  }, []);

  // Fetch notifications list
  const fetchNotificationsList = async () => {
    setIsLoading(true);
    try {
      const res = await getAppNotifications({
        per_page: 20,
        class: "ConsentRevokedNotification",
      });
      if (res.success && res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
        const unreadFromList = res.data.filter((item) => !item.read_at).length;
        setUnreadCount((prev) => Math.max(prev, unreadFromList));
      }
    } catch (err) {
      console.error("Gagal memuat daftar notifikasi Guru BK:", err);
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
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).replace(".", ":");
    } catch {
      return isoString || "-";
    }
  };

  // Mark single notification as read & navigate
  const handleItemClick = async (item: AppNotificationItem) => {
    // 1. Mark as read if not yet read
    if (!item.read_at) {
      try {
        await markNotificationAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Gagal menandai notifikasi:", err);
      }
    }

    setIsOpen(false);

    // 2. Navigate based on notification type
    const isConsentRevoked =
      item.type === "ConsentRevokedNotification" ||
      item.data?.type === "consent_revoked" ||
      item.data?.counseling_status === "menunggu_diskusi";

    if (isConsentRevoked && item.data?.counseling_id) {
      const studentName = item.data?.student_name || "";
      router.push(
        `/dashboard/student-data/${item.data.counseling_id}${
          studentName ? `?name=${encodeURIComponent(studentName)}` : ""
        }`
      );
    } else if (item.data?.url) {
      router.push(item.data.url);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      const res = await markAllNotificationsAsRead({
        class: "ConsentRevokedNotification",
      });
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifikasi Guru BK"
          className="relative flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
        >
          <Bell className="w-5 h-5 text-indigo-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[410px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white overflow-hidden z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
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
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-50 cursor-pointer"
                title="Tandai semua sudah dibaca"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai dibaca</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 rounded-lg p-1 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-3 max-h-[440px] overflow-y-auto space-y-2.5">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2 text-indigo-600" />
              <span className="text-sm">Memuat notifikasi...</span>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => {
              const isUnread = item.read_at === null;
              const isConsentRevoked =
                item.type === "ConsentRevokedNotification" ||
                item.data?.type === "consent_revoked" ||
                item.data?.counseling_status === "menunggu_diskusi";

              const studentName = item.data?.student_name || "Siswa";
              const studentRoom = item.data?.student_room || item.data?.room || "-";
              const formattedTime =
                item.data?.formatted_time ||
                formatTime(item.data?.revoked_at || item.data?.time || item.created_at);

              // 1. Consent Revoked Notification
              if (isConsentRevoked) {
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "p-3 rounded-xl transition-all border cursor-pointer",
                      isUnread
                        ? "bg-purple-50/50 border-purple-200/80 hover:bg-purple-50/80"
                        : "bg-white border-gray-100 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 text-purple-700 font-semibold text-xs">
                        <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Persetujuan Dicabut</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-gray-400 font-normal">
                          {formattedTime}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 text-sm leading-snug mb-1">
                      {studentName} ({studentRoom})
                    </h4>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2">
                      {item.data?.message ||
                        `${studentName} telah mencabut persetujuan akses data. Silakan ajak siswa berdialog.`}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-purple-100/50">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700">
                        Menunggu Diskusi
                      </span>
                      <span className="text-xs text-indigo-600 font-medium hover:underline">
                        Lihat Data Kasus →
                      </span>
                    </div>
                  </div>
                );
              }

              // 2. Alert / Other Notification Types
              const isRedZone =
                item.type === "RedZoneAlertNotification" ||
                item.data?.zone === "Red Zone" ||
                item.data?.level === "critical";

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "p-3 rounded-xl transition-all border cursor-pointer",
                    isUnread
                      ? "bg-rose-50/40 border-rose-200/80 hover:bg-rose-50/70"
                      : "bg-white border-gray-100 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 text-rose-700 font-semibold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{isRedZone ? "Peringatan Red Zone" : "Pemberitahuan"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-gray-400 font-normal">
                        {formattedTime}
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm leading-snug mb-1">
                    {studentName} ({studentRoom})
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2">
                    {item.data?.message || "Memerlukan perhatian dan tindak lanjut Guru BK."}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-700">
                      {item.data?.zone || "Alert"}
                    </span>
                    <span className="text-xs text-indigo-600 font-medium hover:underline">
                      Lihat Detail →
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-sm text-gray-400">
              Tidak ada notifikasi saat ini
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
