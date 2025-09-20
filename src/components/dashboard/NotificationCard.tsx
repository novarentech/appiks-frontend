"use client";

import { Bell, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationGroup } from "@/components/features/notifications/NotificationGroup";
import { Notification, GroupConfig } from "@/types/notifications";
import { sampleNotifications } from "@/data/notifications";

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

  const activeNotifications = sampleNotifications.filter(
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
    {} as Record<string, Notification[]>
  );

  const unreadCount = activeNotifications.filter((n) => n.isNew).length;

  const groupConfig: Record<string, GroupConfig> = {
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
            const config = groupConfig[groupType];
            if (!config) return null;

            return (
              <NotificationGroup
                key={groupType}
                groupType={groupType}
                notifications={groupNotifications}
                config={config}
                isExpanded={expandedGroup === groupType}
                onToggleGroup={toggleGroupExpand}
                onToggleNotification={toggleExpand}
                onDismissNotification={dismissNotification}
                expandedNotificationId={expandedNotification}
                size="sm"
              />
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
