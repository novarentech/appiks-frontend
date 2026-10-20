import { LucideIcon } from "lucide-react";
import { LatestBooking } from "./api";

export interface NotificationChanges {
  oldTeacher: string;
  oldDate: string;
  oldTime: string;
  oldRoom: string;
}

export type NotificationType = "counseling" | "curhat" | "rujukan";
export type NotificationStatus =
  | "disetujui"
  | "dijadwal_ulang"
  | "selesai"
  | "dibatalkan"
  | "ditolak"
  | "dibalas"
  | "dikirim"
  | "menunggu"
  | "menunggu_jadwal"
  | "menunggu_konfirmasi"
  | "dijadwalkan"
  | "butuh_persetujuan"
  | "terkonfirmasi"
  | "perubahan_jadwal"
  | "expired"
  | "menunggu_diskusi";

export interface BaseNotification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  teacher: string;
  date: string;
  status: NotificationStatus;
  statusText: string;
  statusColor: string;
  borderColor: string;
  icon: LucideIcon;
  isNew: boolean;
  hasNewTag?: boolean;
  createdAt?: string;
}

export interface CounselingNotification extends BaseNotification {
  type: "counseling";
  time: string;
  room: string;
  notes?: string;
  noteDate?: string;
  changes?: NotificationChanges;
}

export interface CurhatNotification extends BaseNotification {
  type: "curhat";
  curhatDescription?: string;
  reply?: string;
  replyDate?: string;
}

export interface ReferralNotification extends BaseNotification {
  type: "rujukan";
  psychologist: string;
  location: string;
  counselor: string;
  referralReason: string;
  referralDate: string;
  time?: string;
  clinicalNotes?: string;
  latest_booking?: LatestBooking | null;
}

export type Notification = CounselingNotification | CurhatNotification | ReferralNotification;

export interface GroupConfig {
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

export type GroupType = "counseling" | "curhat" | "rujukan";
