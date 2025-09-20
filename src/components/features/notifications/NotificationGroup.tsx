"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Notification, GroupConfig } from "@/types/notifications";
import { NotificationItem } from "./NotificationItem";

interface NotificationGroupProps {
  groupType: string;
  notifications: Notification[];
  config: GroupConfig;
  isExpanded: boolean;
  onToggleGroup: (groupType: string) => void;
  onToggleNotification?: (id: number) => void;
  onDismissNotification?: (id: number) => void;
  expandedNotificationId?: number | null;
  size?: "sm" | "md";
}

export function NotificationGroup({
  groupType,
  notifications,
  config,
  isExpanded,
  onToggleGroup,
  onToggleNotification,
  onDismissNotification,
  expandedNotificationId,
  size = "sm",
}: NotificationGroupProps) {
  const GroupIcon = config.icon;
  const isSm = size === "sm";

  const handleToggleGroup = () => {
    onToggleGroup(groupType);
  };

  return (
    <motion.div
      className={`border border-gray-200 ${
        isSm ? "rounded-xl sm:rounded-2xl" : "rounded-xl sm:rounded-2xl"
      } overflow-hidden hover:shadow-md transition-shadow duration-300`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Group Header */}
      <motion.button
        className={`w-full ${config.bgColor} ${
          isSm ? "p-3 sm:p-4" : "p-3 sm:p-4"
        } flex items-center justify-between hover:opacity-80 transition-opacity`}
        onClick={handleToggleGroup}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div
          className={`flex items-center space-x-2 ${
            isSm ? "sm:space-x-3" : "sm:space-x-3"
          } min-w-0`}
        >
          <div
            className={`${
              isSm ? "p-1.5 sm:p-2" : "p-1.5 sm:p-2"
            } rounded-full bg-white shadow-sm flex-shrink-0`}
          >
            <GroupIcon
              className={`${
                isSm ? "w-4 h-4 sm:w-5 sm:h-5" : "w-4 h-4 sm:w-5 sm:h-5"
              } ${config.textColor}`}
            />
          </div>
          <div className="text-left min-w-0">
            <h4
              className={`font-semibold ${
                isSm ? "text-sm sm:text-base" : "text-sm sm:text-base"
              } ${config.textColor} truncate`}
            >
              {config.title}
            </h4>
            <p
              className={`${
                isSm ? "text-xs sm:text-sm" : "text-xs sm:text-sm"
              } text-gray-600`}
            >
              {notifications.length} item
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown
            className={`${
              isSm ? "w-4 h-4 sm:w-5 sm:h-5" : "w-4 h-4 sm:w-5 sm:h-5"
            } ${config.textColor}`}
          />
        </motion.div>
      </motion.button>

      {/* Group Content */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="divide-y divide-gray-100">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={onDismissNotification}
              onToggleExpand={onToggleNotification}
              isExpanded={expandedNotificationId === notification.id}
              index={index}
              size={size}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
