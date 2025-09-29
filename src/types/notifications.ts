import { LucideIcon } from "lucide-react";

export interface NotificationChanges {
  oldTeacher: string;
  oldDate: string;
  oldTime: string;
  oldRoom: string;
}

export type NotificationType = "counseling" | "curhat";
export type NotificationStatus =
  | "disetujui"
  | "dijadwal_ulang"
  | "selesai"
  | "dibatalkan"
  | "dibalas"
  | "dikirim"
  | "menunggu"
  | "dijadwalkan";

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

export type Notification = CounselingNotification | CurhatNotification;

export interface GroupConfig {
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

export type GroupType = "counseling" | "curhat";
