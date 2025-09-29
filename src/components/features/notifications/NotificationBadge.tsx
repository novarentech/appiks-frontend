"use client";

import { Calendar, Clock, Building, User } from "lucide-react";
import { Notification } from "@/types/notifications";

interface NotificationBadgeProps {
  notification: Notification;
  size?: "sm" | "md";
}

export function NotificationBadge({
  notification,
  size = "sm",
}: NotificationBadgeProps) {
  const isSm = size === "sm";
  const badgeClass = `${isSm ? "text-xs" : "text-xs sm:text-sm"} ${
    isSm ? "px-2 py-1" : "px-2 sm:px-3 py-1"
  } rounded-full font-medium`;

  if (notification.type === "counseling") {
    return (
      <div
        className={`flex flex-wrap gap-1.5 ${
          isSm ? "text-xs" : "text-xs sm:text-sm"
        }`}
      >
        <div className={`bg-blue-100 text-blue-700 ${badgeClass} flex items-center gap-1`}>
          <Calendar className="w-3 h-3" />
          {notification.date}
        </div>
        <div className={`bg-green-100 text-green-700 ${badgeClass} flex items-center gap-1`}>
          <Clock className="w-3 h-3" />
          {notification.time}
        </div>
        <div className={`bg-purple-100 text-purple-700 ${badgeClass} flex items-center gap-1`}>
          <Building className="w-3 h-3" />
          {notification.room}
        </div>
        <div className={`bg-orange-100 text-orange-700 ${badgeClass} flex items-center gap-1`}>
          <User className="w-3 h-3" />
          {notification.teacher}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap gap-1.5 ${
        isSm ? "text-xs" : "text-xs sm:text-sm"
      }`}
    >
      <div className={`bg-blue-100 text-blue-700 ${badgeClass} flex items-center gap-1`}>
        <Calendar className="w-3 h-3" />
        {notification.date}
      </div>
      <div className={`bg-orange-100 text-orange-700 ${badgeClass} flex items-center gap-1`}>
        <User className="w-3 h-3" />
        {notification.teacher}
      </div>
    </div>
  );
}
