"use client";

import { Bell, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { allNotifications } from "@/data/notifications";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationsPage() {
  const { isLoading, isAuthenticated, isVerified } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "counseling" | "curhat">("all");
  const [expandedNotification, setExpandedNotification] = useState<
    number | null
  >(null);

  const toggleExpand = (id: number) => {
    setExpandedNotification(expandedNotification === id ? null : id);
  };

  const filteredNotifications = allNotifications.filter((notification) => {
    if (filter === "all") return true;
    return notification.type === filter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      {/* Header */}
    <motion.div
        className="space-y-6 sm:space-y-8 lg:space-y-12 mb-8 sm:mb-12 lg:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        {/* Back Button */}
        <Button
            variant="ghost"
            className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group"
            onClick={() => router.back()}
        >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Ke Halaman Beranda
        </Button>

        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            History Notifikasi
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Riwayat lengkap jadwal konseling dan curhatan
            </p>
        </div>
    </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2 mb-4 sm:mb-6 bg-white p-2 rounded-2xl shadow-lg overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          {
            key: "all",
            label: "Semua",
            shortLabel: "Semua",
            count: allNotifications.length,
          },
          {
            key: "counseling",
            label: "Jadwal Konseling",
            shortLabel: "Konseling",
            count: allNotifications.filter((n) => n.type === "counseling")
              .length,
          },
          {
            key: "curhat",
            label: "Status Curhat",
            shortLabel: "Curhat",
            count: allNotifications.filter((n) => n.type === "curhat").length,
          },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
              filter === tab.key
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setFilter(tab.key as typeof filter)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span
              className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                filter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NotificationItem
              notification={notification}
              onToggleExpand={toggleExpand}
              isExpanded={expandedNotification === notification.id}
              index={index}
              size="md"
              showActions={true}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <motion.div
          className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-gray-600 font-medium mb-2 text-sm sm:text-base">
            Tidak ada notifikasi
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            Belum ada notifikasi untuk kategori ini
          </p>
        </motion.div>
      )}
    </div>
  );
}
