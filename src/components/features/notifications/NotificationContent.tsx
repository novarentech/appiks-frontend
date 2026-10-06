"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { acknowledgeCounselingSchedule } from "@/lib/api";

import {
  Notification,
  CounselingNotification,
  CurhatNotification,
  ReferralNotification,
} from "@/types/notifications";
import { ChangesSummary } from "./ChangesSummary";
import { Button } from "@/components/ui/button";
import { ManageConsentDialog } from "./ManageConsentDialog";

interface NotificationContentProps {
  notification: Notification;
  size?: "sm" | "md";
}

export function NotificationContent({
  notification,
  size = "sm",
}: NotificationContentProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleAcknowledge = async (id: number, type: "accept" | "reject") => {
    try {
      if (type === "accept") setIsAccepting(true);
      else setIsRejecting(true);
      await acknowledgeCounselingSchedule(id, type);
      window.location.reload();
    } catch (error) {
      console.error("Failed to acknowledge schedule", error);
    } finally {
      setIsAccepting(false);
      setIsRejecting(false);
    }
  };

  const isSm = size === "sm";
  const textSize = isSm ? "text-xs" : "text-sm";
  const headerSize = isSm ? "text-xs" : "text-sm";
  const marginBottom = isSm ? "mb-1" : "mb-2";

  if (notification.type === "counseling") {
    const counselingNotification = notification as CounselingNotification;

    return (
      <div className="space-y-2">
        {counselingNotification.notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h6
              className={`font-medium ${headerSize} text-gray-700 ${marginBottom}`}
            >
              Catatan:
            </h6>
            <p className={`${textSize} text-gray-600 mb-2`}>
              {counselingNotification.notes}
            </p>
            <p className={`${isSm ? "text-xs" : "text-xs"} text-gray-400`}>
              Dibuat: {counselingNotification.noteDate}
            </p>
          </div>
        )}

        <ChangesSummary notification={counselingNotification} size={size} />

        {counselingNotification.status === "menunggu" && (
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-[#EA580C] text-[#EA580C] hover:bg-orange-50"
              onClick={(e) => {
                e.stopPropagation();
                handleAcknowledge(counselingNotification.id, "reject");
              }}
              disabled={isAccepting || isRejecting}
            >
              {isRejecting ? "Memproses..." : "Tolak Jadwal"}
            </Button>
            <Button
              className="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleAcknowledge(counselingNotification.id, "accept");
              }}
              disabled={isAccepting || isRejecting}
            >
              {isAccepting ? "Memproses..." : "Setujui Jadwal"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (notification.type === "curhat") {
    const curhatNotification = notification as CurhatNotification;

    return (
      <div className={`space-y-2 ${isSm ? "space-y-2" : "space-y-3"}`}>
        {curhatNotification.curhatDescription && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h6
              className={`font-medium ${headerSize} text-blue-700 ${marginBottom}`}
            >
              Curhat Anda:
            </h6>
            <p className={`${textSize} text-blue-600`}>
              {curhatNotification.curhatDescription}
            </p>
          </div>
        )}

        {curhatNotification.reply && (
          <div className="bg-green-50 p-3 rounded-lg">
            <h6
              className={`font-medium ${headerSize} text-green-700 ${marginBottom}`}
            >
              Balasan Konselor:
            </h6>
            <p className={`${textSize} text-green-600 mb-2`}>
              {curhatNotification.reply}
            </p>
            {curhatNotification.replyDate && (
              <p
                className={`${textSize} text-green-500 ${
                  isSm ? "" : "font-medium"
                }`}
              >
                Dibalas pada: {curhatNotification.replyDate}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (notification.type === "rujukan") {
    const referralNotification = notification as ReferralNotification;
    const [isConsentOpen, setIsConsentOpen] = useState(false);

    return (
      <div className={`space-y-4 ${isSm ? "space-y-3" : "space-y-4"}`}>
        {referralNotification.status !== "selesai" && (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            {referralNotification.status !== "dijadwalkan" && (
              <>
                <h6
                  className={`font-medium ${headerSize} text-gray-700 ${marginBottom}`}
                >
                  Alasan Rujukan:
                </h6>
                <p className={`${textSize} text-gray-600 mb-3`}>
                  {referralNotification.referralReason}
                </p>
              </>
            )}
            {referralNotification.status !== "menunggu" && referralNotification.time && referralNotification.time !== "-" && (
              <>
                <h6 className={`font-medium ${headerSize} text-gray-700 mt-4 mb-1`}>
                  Jadwal Konsultasi
                </h6>
                <div className={`${textSize} text-gray-600 space-y-1 mb-3`}>
                  <p>Waktu: {referralNotification.referralDate} {referralNotification.time}</p>
                  <p>Lokasi: {referralNotification.location}</p>
                </div>
              </>
            )}
            {referralNotification.status !== "menunggu" && (
              <p className={`${isSm ? "text-[10px]" : "text-xs"} text-gray-400`}>
                Dibuat pada : {referralNotification.referralDate}
              </p>
            )}
          </div>
        )}

        {referralNotification.status === "menunggu" && (
          <>
            <Button
              className="w-full bg-primary hover:bg-primary/80 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setIsConsentOpen(true);
              }}
            >
              Kelola Persetujuan
            </Button>
            <ManageConsentDialog
              isOpen={isConsentOpen}
              onOpenChange={setIsConsentOpen}
              counselingId={referralNotification.id}
            />
          </>
        )}

        {referralNotification.status === "expired" && (
          <Button
            className="w-full bg-[#E13A4B] hover:bg-[#C92F3E] text-white mt-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/rujukan/${referralNotification.id}/schedule`);
            }}
          >
            Pilih Jadwal Baru
          </Button>
        )}

        {referralNotification.status === "selesai" && referralNotification.clinicalNotes && (
          <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
            <h6 className="font-semibold text-gray-800 mb-2">Catatan Klinis</h6>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {referralNotification.clinicalNotes}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
