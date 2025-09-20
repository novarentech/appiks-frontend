"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/notifications";
import { NotificationBadge } from "./NotificationBadge";
import { NotificationContent } from "./NotificationContent";

interface NotificationItemProps {
  notification: Notification;
  onDismiss?: (id: number) => void;
  onToggleExpand?: (id: number) => void;
  isExpanded?: boolean;
  index?: number;
  size?: "sm" | "md";
  showActions?: boolean;
}

export function NotificationItem({
  notification,
  onDismiss,
  onToggleExpand,
  isExpanded = false,
  index = 0,
  size = "sm",
  showActions = true,
}: NotificationItemProps) {
  const Icon = notification.icon;
  const isSm = size === "sm";

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand(notification.id);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(notification.id);
    }
  };

  return (
    <motion.div
      className={`${
        isSm ? "p-3 sm:p-4" : "p-4 sm:p-6"
      } bg-white hover:bg-gray-50 transition-colors`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        className={`flex items-start space-x-2 ${
          isSm ? "sm:space-x-3" : "sm:space-x-4"
        }`}
      >
        <motion.div
          className={`${isSm ? "p-1.5 sm:p-2" : "p-2 sm:p-3"} rounded-full bg-${
            notification.statusColor
          }-100 ${isSm ? "mt-1" : ""} flex-shrink-0`}
          whileHover={{ rotate: 10 }}
        >
          <Icon
            className={`${
              isSm ? "w-3 h-3 sm:w-4 sm:h-4" : "w-4 h-4 sm:w-5 sm:h-5"
            } text-${notification.statusColor}-600`}
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div
            className={`flex flex-col ${
              isSm
                ? "sm:flex-row sm:items-center sm:justify-between"
                : "sm:flex-row sm:items-center sm:justify-between"
            } mb-2 gap-1 sm:gap-0`}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <h5
                className={`font-medium ${
                  isSm ? "text-sm sm:text-base" : "text-sm sm:text-base"
                } text-gray-800 truncate`}
              >
                {isSm ? notification.description : notification.title}
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
              className={`text-xs bg-${notification.statusColor}-100 text-${
                notification.statusColor
              }-800 ${
                isSm ? "px-2 sm:px-3" : "px-2 sm:px-3"
              } py-1 rounded-full flex-shrink-0 self-start sm:self-auto`}
              whileHover={{ scale: 1.05 }}
            >
              {notification.statusText}
            </motion.span>
          </div>

          {/* Description for non-sm size */}
          {!isSm && (
            <p className="text-gray-700 mb-3 font-medium text-sm sm:text-base">
              {notification.description}
            </p>
          )}

          {/* Badges */}
          <div className={`${isSm ? "space-y-2" : "mb-4"}`}>
            <NotificationBadge notification={notification} size={size} />
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
                <NotificationContent notification={notification} size={size} />

                {/* Actions */}
                {showActions && (
                  <div
                    className={`flex flex-col gap-2 ${
                      isSm ? "sm:gap-3" : "sm:gap-3"
                    }`}
                  >
                    <motion.button
                      onClick={handleDismiss}
                      className={`${
                        isSm ? "text-xs" : "text-xs sm:text-sm"
                      } text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-full transition-colors w-full sm:w-auto`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Hapus notifikasi
                    </motion.button>
                    {notification.type === "counseling" &&
                      notification.status === "disetujui" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`bg-green-50 border-green-200 text-green-700 hover:bg-green-100 w-full sm:w-auto ${
                            isSm ? "text-xs" : "text-xs sm:text-sm"
                          }`}
                        >
                          Join Meeting
                        </Button>
                      )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Toggle button */}
          {onToggleExpand && (
            <Button
              variant="ghost"
              size="sm"
              className={`text-blue-600 p-0 h-auto mt-2 hover:text-blue-800 w-full sm:w-auto justify-start`}
              onClick={handleToggleExpand}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  className={`${
                    isSm ? "w-3 h-3 sm:w-4 sm:h-4" : "w-3 h-3 sm:w-4 sm:h-4"
                  } mr-1`}
                />
              </motion.div>
              <span
                className={`${
                  isSm ? "text-xs sm:text-sm" : "text-xs sm:text-sm"
                }`}
              >
                {isExpanded ? "Sembunyikan" : "Selengkapnya"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
