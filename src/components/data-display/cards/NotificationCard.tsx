"use client";

import {
  Bell,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

const notifications = [
  {
    id: 1,
    type: "counseling",
    title: "Jadwal Konseling",
    description: "Masalah dengan Teman Sekelas",
    teacher: "Sri Wahyuni, S.Pd, M.Pd",
    date: "10/10/2025",
    time: "10:00",
    room: "Ruang BK-1",
    status: "disetujui",
    statusText: "Disetujui",
    statusColor: "green",
    borderColor: "border-green-400",
    icon: CheckCircle,
    isNew: true,
    notes: "Konseling telah disetujui dan dijadwalkan",
    noteDate: "08/10/2025 09:30",
  },
  {
    id: 2,
    type: "counseling",
    title: "Jadwal Konseling",
    description: "Diskusi tentang Stress Belajar",
    teacher: "Ahmad Ridwan, S.Pd",
    date: "12/10/2025",
    time: "14:00",
    room: "Ruang BK-2",
    status: "dijadwal_ulang",
    statusText: "Dijadwal Ulang",
    statusColor: "orange",
    borderColor: "border-orange-400",
    icon: Clock,
    isNew: true,
    notes: "Jadwal diubah karena bentrok dengan kegiatan sekolah",
    noteDate: "09/10/2025 11:20",
    changes: {
      oldTeacher: "Sri Wahyuni, S.Pd, M.Pd",
      oldDate: "11/10/2025",
      oldTime: "10:00",
      oldRoom: "Ruang BK-1",
    },
  },
  {
    id: 3,
    type: "curhat",
    title: "Status Curhatmu",
    description: "Konflik dengan Orang Tua",
    teacher: "Sri Wahyuni, S.Pd, M.Pd",
    date: "07/10/2025 15:30",
    status: "dibalas",
    statusText: "Dibalas",
    statusColor: "blue",
    borderColor: "border-blue-400",
    icon: Bell,
    isNew: true,
    curhatDescription:
      "Saya sedang mengalami konflik dengan orang tua karena mereka tidak memahami pilihan karir saya...",
    reply:
      "Terima kasih sudah berbagi. Konflik dengan orang tua memang sulit, coba komunikasikan dengan baik dan tunjukkan rencana masa depan yang matang.",
    replyDate: "08/10/2025 09:15",
  },
  {
    id: 4,
    type: "curhat",
    title: "Status Curhatmu",
    description: "Kesulitan dalam Belajar",
    teacher: "Ahmad Ridwan, S.Pd",
    date: "08/10/2025 16:30",
    status: "dikirim",
    statusText: "Dikirim",
    statusColor: "amber",
    borderColor: "border-amber-400",
    icon: AlertCircle,
    isNew: true,
    curhatDescription:
      "Saya merasa kesulitan memahami pelajaran matematika, terutama pada materi kalkulus...",
  },
];

export function NotificationCard() {
  const router = useRouter();
  const [expandedNotification, setExpandedNotification] = useState<
    number | null
  >(null);
  const [dismissedNotifications, setDismissedNotifications] = useState<
    number[]
  >([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedNotification(expandedNotification === id ? null : id);
  };

  const toggleGroupExpand = (groupType: string) => {
    setExpandedGroup(expandedGroup === groupType ? null : groupType);
  };

  const dismissNotification = (id: number) => {
    setDismissedNotifications([...dismissedNotifications, id]);
  };

  const activeNotifications = notifications.filter(
    (n) => !dismissedNotifications.includes(n.id) && n.isNew
  );

  // Group notifications by type
  const groupedNotifications = activeNotifications.reduce(
    (groups, notification) => {
      const type = notification.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(notification);
      return groups;
    },
    {} as Record<string, typeof notifications>
  );

  const unreadCount = activeNotifications.filter((n) => n.isNew).length;

  const groupConfig = {
    counseling: {
      title: "Jadwal Konseling",
      icon: CheckCircle,
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    curhat: {
      title: "Status Curhatmu",
      icon: Bell,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <motion.div className="relative" whileHover={{ scale: 1.1 }}>
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              {unreadCount > 0 && (
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {unreadCount}
                </motion.div>
              )}
            </motion.div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Notifikasi
              </h3>
              <p className="text-indigo-100 text-xs sm:text-sm">
                {activeNotifications.length} item tersedia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications by Groups */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
        {Object.entries(groupedNotifications).map(
          ([groupType, groupNotifications]) => {
            const config = groupConfig[groupType as keyof typeof groupConfig];
            const isGroupExpanded = expandedGroup === groupType;
            const GroupIcon = config.icon;

            return (
              <motion.div
                key={groupType}
                className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Group Header */}
                <motion.button
                  className={`w-full ${config.bgColor} p-3 sm:p-4 flex items-center justify-between hover:opacity-80 transition-opacity`}
                  onClick={() => toggleGroupExpand(groupType)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div
                      className={`p-1.5 sm:p-2 rounded-full bg-white shadow-sm flex-shrink-0`}
                    >
                      <GroupIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${config.textColor}`}
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <h4
                        className={`font-semibold text-sm sm:text-base ${config.textColor} truncate`}
                      >
                        {config.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {groupNotifications.length} item
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isGroupExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${config.textColor}`}
                    />
                  </motion.div>
                </motion.button>

                {/* Group Content */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isGroupExpanded ? "auto" : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="divide-y divide-gray-100">
                    {groupNotifications.map((notification, index) => {
                      const Icon = notification.icon;
                      const isExpanded =
                        expandedNotification === notification.id;

                      return (
                        <motion.div
                          key={notification.id}
                          className="p-3 sm:p-4 bg-white hover:bg-gray-50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <motion.div
                              className={`p-1.5 sm:p-2 rounded-full bg-${notification.statusColor}-100 mt-1 flex-shrink-0`}
                              whileHover={{ rotate: 10 }}
                            >
                              <Icon
                                className={`w-3 h-3 sm:w-4 sm:h-4 text-${notification.statusColor}-600`}
                              />
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                                <div className="flex items-center space-x-2 min-w-0">
                                  <h5 className="font-medium text-sm sm:text-base text-gray-800 truncate">
                                    {notification.description}
                                  </h5>
                                  {notification.isNew && (
                                    <motion.span
                                      className="text-xs bg-red-500 text-white px-2 py-1 rounded-full flex-shrink-0"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.3 }}
                                    >
                                      Baru
                                    </motion.span>
                                  )}
                                </div>
                                <motion.span
                                  className={`text-xs bg-${notification.statusColor}-100 text-${notification.statusColor}-800 px-2 sm:px-3 py-1 rounded-full flex-shrink-0 self-start sm:self-auto`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {notification.statusText}
                                </motion.span>
                              </div>

                              {/* Mobile-first layout for details with badges */}
                              <div className="space-y-2">
                                {notification.type === "counseling" ? (
                                  <div className="flex flex-wrap gap-1.5 text-xs">
                                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                      📅 {notification.date}
                                    </div>
                                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                      ⏰ {notification.time}
                                    </div>
                                    <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                      🏢 {notification.room}
                                    </div>
                                    <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                      👨‍🏫 {notification.teacher}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5 text-xs">
                                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                      📅 {notification.date}
                                    </div>
                                    <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                      👨‍🏫 {notification.teacher}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Expanded details */}
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: isExpanded ? "auto" : 0,
                                  opacity: isExpanded ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 border-t border-gray-100 mt-3">
                                  <div className="space-y-3">
                                    {/* Show content based on type */}
                                    {notification.type === "counseling" && (
                                      <div className="space-y-2">
                                        {notification.notes && (
                                          <div className="bg-gray-50 p-3 rounded-lg">
                                            <h6 className="font-medium text-xs text-gray-700 mb-1">
                                              Catatan:
                                            </h6>
                                            <p className="text-xs text-gray-600 mb-2">
                                              {notification.notes}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                              Dibuat: {notification.noteDate}
                                            </p>
                                          </div>
                                        )}

                                        {notification.status ===
                                          "dijadwal_ulang" &&
                                          notification.changes && (
                                            <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                                              <h6 className="font-medium text-xs text-yellow-800 mb-2">
                                                Perubahan Jadwal:
                                              </h6>
                                              <div className="space-y-1.5 text-xs">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-gray-600">
                                                    Guru:
                                                  </span>
                                                  <div className="text-right">
                                                    <div className="line-through text-red-600">
                                                      {
                                                        notification.changes
                                                          .oldTeacher
                                                      }
                                                    </div>
                                                    <div className="text-green-600 font-medium">
                                                      {notification.teacher}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                  <span className="text-gray-600">
                                                    Tanggal:
                                                  </span>
                                                  <div className="text-right">
                                                    <div className="line-through text-red-600">
                                                      {
                                                        notification.changes
                                                          .oldDate
                                                      }
                                                    </div>
                                                    <div className="text-green-600 font-medium">
                                                      {notification.date}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                  <span className="text-gray-600">
                                                    Jam:
                                                  </span>
                                                  <div className="text-right">
                                                    <div className="line-through text-red-600">
                                                      {
                                                        notification.changes
                                                          .oldTime
                                                      }
                                                    </div>
                                                    <div className="text-green-600 font-medium">
                                                      {notification.time}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                  <span className="text-gray-600">
                                                    Ruang:
                                                  </span>
                                                  <div className="text-right">
                                                    <div className="line-through text-red-600">
                                                      {
                                                        notification.changes
                                                          .oldRoom
                                                      }
                                                    </div>
                                                    <div className="text-green-600 font-medium">
                                                      {notification.room}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    )}

                                    {notification.type === "curhat" && (
                                      <div className="space-y-2">
                                        {notification.curhatDescription && (
                                          <div className="bg-blue-50 p-3 rounded-lg">
                                            <h6 className="font-medium text-xs text-blue-700 mb-1">
                                              Curhat Anda:
                                            </h6>
                                            <p className="text-xs text-blue-600">
                                              {notification.curhatDescription}
                                            </p>
                                          </div>
                                        )}

                                        {notification.reply && (
                                          <div className="bg-green-50 p-3 rounded-lg">
                                            <h6 className="font-medium text-xs text-green-700 mb-1">
                                              Balasan Konselor:
                                            </h6>
                                            <p className="text-xs text-green-600 mb-2">
                                              {notification.reply}
                                            </p>
                                            {notification.replyDate && (
                                              <p className="text-xs text-green-500">
                                                Dibalas pada:{" "}
                                                {notification.replyDate}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Hapus button */}
                                    <motion.button
                                      onClick={() =>
                                        dismissNotification(notification.id)
                                      }
                                      className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-full transition-colors w-full sm:w-auto"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      Hapus notifikasi
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Toggle button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 p-0 h-auto mt-2 hover:text-blue-800 w-full sm:w-auto justify-start"
                                onClick={() => toggleExpand(notification.id)}
                              >
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                </motion.div>
                                <span className="text-xs sm:text-sm">
                                  {isExpanded ? "Sembunyikan" : "Selengkapnya"}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            );
          }
        )}
      </div>

      {/* Empty state */}
      {activeNotifications.length === 0 && (
        <motion.div
          className="text-center py-8 sm:py-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          </motion.div>
          <h4 className="text-gray-600 font-medium mb-2 text-sm sm:text-base">
            Tidak ada notifikasi
          </h4>
          <p className="text-gray-400 text-xs sm:text-sm">
            Semua notifikasi sudah dibaca atau dihapus
          </p>
        </motion.div>
      )}

      {/* View All Notifications Button */}
      {activeNotifications.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
          <motion.button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/notifications")}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Lihat Semua Notifikasi</span>
            <motion.div
              className="bg-white/20 px-2 py-1 rounded-full text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {activeNotifications.length}
            </motion.div>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
