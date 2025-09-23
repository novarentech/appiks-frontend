// API response types

export interface MoodRecordRequest {
  status: string;
}

export interface MoodRecordResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    pesan: string;
    isSafe: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Quote API types
export interface Quote {
  id: number;
  school_id: number;
  text: string;
  author: string;
  type: string;
}

export interface QuoteResponse {
  success: boolean;
  message: string;
  data: Quote[] | Quote;
}

// Bulk Import API types
export interface BulkTemplateResponse {
  success: boolean;
  message: string;
  data: {
    link: string;
  };
}

// Interface untuk response API dashboard mood graph
export interface DashboardMoodGraphResponse {
  success: boolean;
  message: string;
  data: {
    neutral: number;
    sad: number;
    happy: number;
    angry: number;
  };
}

// Interface untuk LastMoodRes
export interface LastMoodRes {
  recorded: string;
  status: string;
}

// Interface untuk Room
export interface Room {
  id: number;
  name: string;
  code: string;
  school_id: number;
}

// Interface untuk Mentor
export interface Mentor {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  mentor_id: string | null;
  counselor_id: string | null;
  room_id: number | null;
  school_id: number;
}

// Interface untuk Student
export interface Student {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  room: Room;
  mentor: Mentor;
  lastmoodres: LastMoodRes | null;
}

// Interface untuk response API dashboard student
export interface DashboardStudentResponse {
  success: boolean;
  message: string;
  data: Student[];
}

// Interface untuk response API mood pattern
export interface MoodRecap {
  sad: number;
  neutral: number;
  angry: number;
  happy: number;
}

export interface MoodItem {
  recorded: string;
  status: string;
}

export interface MoodPatternUser {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  mentor_id: number;
  counselor_id: number;
  room_id: number;
  school_id: number;
}

export interface MoodPatternData {
  recap: MoodRecap;
  mean: string;
  moods: MoodItem[];
  user: MoodPatternUser;
}

export interface MoodPatternResponse {
  success: boolean;
  message: string;
  data: MoodPatternData;
}

export interface BulkImportResponse {
  success: boolean;
  message: string;
  data: string;
}

// Interface untuk response API dashboard report graph
export interface DashboardReportGraphResponse {
  success: boolean;
  message: string;
  data: {
    report: Record<string, number>;
    sharing: Record<string, number>;
  };
}

// Interface untuk User dalam konteks sharing/curhat
export interface SharingUser {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  room?: {
    id: number;
    name: string;
    code: string;
    school_id: number;
  };
}

// Interface untuk Curhat/Sharing
export interface Sharing {
  id: number;
  user_id: number;
  title: string;
  description: string;
  reply?: string;
  replied_at?: string;
  replied_by?: string;
  priority: "rendah" | "tinggi";
  created_at: string;
  user: SharingUser;
}

// Interface untuk response API sharing list
export interface SharingListResponse {
  success: boolean;
  message: string;
  data: Sharing[];
}

// Interface untuk response API sharing detail
export interface SharingDetailResponse {
  success: boolean;
  message: string;
  data: Sharing;
}

// Interface untuk response API reply sharing
export interface SharingReplyResponse {
  success: boolean;
  message: string;
  data: Sharing;
}

// Interface untuk request reply sharing
export interface SharingReplyRequest {
  text: string;
}

// Interface untuk request create sharing
export interface SharingCreateRequest {
  title: string;
  description: string;
}

// Interface untuk response create sharing
export interface SharingCreateResponse {
  success: boolean;
  message: string;
  data: Sharing;
}

// Interface untuk Counseling Schedule
export interface ReportUser {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  room: {
    id: number;
    name: string;
    code: string;
    school_id: number;
  };
}

export interface ReportCounselor {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
}

export interface Report {
  id: number;
  user_id: number;
  counselor_id: number;
  topic: string;
  room: string;
  date: string;
  time: string;
  status: "menunggu" | "disetujui" | "dijadwalkan" | "selesai" | "dibatalkan";
  priority: "rendah" | "sedang" | "tinggi";
  notes: string;
  result: string;
  created_at: string;
  user: ReportUser;
  counselor: ReportCounselor;
}

export interface ReportListResponse {
  success: boolean;
  message: string;
  data: Report[];
}

export interface ReportConfirmRequest {
  date: string;
  time: string;
  notes: string;
  room: string;
}

export interface ReportConfirmResponse {
  success: boolean;
  message: string;
  data: Report;
}

export interface ReportCloseRequest {
  result: string;
}

export interface ReportCloseResponse {
  success: boolean;
  message: string;
  data: Report;
}

export interface ReportRescheduleRequest {
  date: string;
  time: string;
  notes: string;
  room: string;
}

export interface ReportRescheduleResponse {
  success: boolean;
  message: string;
  data: Report;
}

export interface ReportCancelRequest {
  result: string;
}

export interface ReportCancelResponse {
  success: boolean;
  message: string;
  data: Report;
}

export interface User {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  mentor_id: number;
  counselor_id: number;
  room_id: number;
  school_id: number;
}
export interface CounselingScheduleCounselor {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
}

export interface CounselingSchedule {
  id: number;
  user_id: number;
  counselor_id: number;
  topic: string;
  room: string;
  date: string;
  time: string;
  status: "menunggu" | "disetujui" | "dijadwalkan" | "selesai" | "dibatalkan";
  priority: "rendah" | "sedang" | "tinggi";
  notes: string;
  result: string;
  created_at: string;
  user: {
    name: string;
    phone: string;
    username: string;
    identifier: string;
    verified: boolean;
    role: string;
    room: {
      id: number;
      name: string;
      code: string;
      school_id: number;
    };
  };
  counselor: CounselingScheduleCounselor;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface CreateReportRequest {
  date: string;
  time: string;
  topic: string;
  room: string;
}

export interface CreateReportResponse {
  success: boolean;
  message: string;
  data: Report;
}

