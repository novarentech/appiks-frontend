"use client";

import { CounselingNotification } from "@/types/notifications";

interface ChangesSummaryProps {
  notification: CounselingNotification;
  size?: "sm" | "md";
}

export function ChangesSummary({
  notification,
  size = "sm",
}: ChangesSummaryProps) {
  if (notification.status !== "dijadwal_ulang" || !notification.changes) {
    return null;
  }

  const isSm = size === "sm";
  const textSize = isSm ? "text-xs" : "text-sm";
  const padding = isSm ? "p-3" : "p-3 sm:p-4";

  return (
    <div
      className={`bg-yellow-50 ${padding} rounded-lg border-l-4 border-yellow-400`}
    >
      <h6
        className={`font-medium ${textSize} text-yellow-800 mb-2 ${
          isSm ? "mb-2" : "mb-3"
        }`}
      >
        Perubahan Jadwal:
      </h6>
      <div
        className={`space-y-1.5 ${textSize} ${
          isSm ? "space-y-1.5" : "space-y-2"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-gray-600 ${isSm ? "" : "font-medium"}`}>
            Guru:
          </span>
          <div className="text-right">
            <div className="line-through text-red-600">
              {notification.changes.oldTeacher}
            </div>
            <div className="text-green-600 font-medium">
              {notification.teacher}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-gray-600 ${isSm ? "" : "font-medium"}`}>
            Tanggal:
          </span>
          <div className="text-right">
            <div className="line-through text-red-600">
              {notification.changes.oldDate}
            </div>
            <div className="text-green-600 font-medium">
              {notification.date}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-gray-600 ${isSm ? "" : "font-medium"}`}>
            Jam:
          </span>
          <div className="text-right">
            <div className="line-through text-red-600">
              {notification.changes.oldTime}
            </div>
            <div className="text-green-600 font-medium">
              {notification.time}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-gray-600 ${isSm ? "" : "font-medium"}`}>
            Ruang:
          </span>
          <div className="text-right">
            <div className="line-through text-red-600">
              {notification.changes.oldRoom}
            </div>
            <div className="text-green-600 font-medium">
              {notification.room}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
