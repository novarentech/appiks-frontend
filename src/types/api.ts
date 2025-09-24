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
  id?: number;
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  mentor_id?: number;
  counselor_id?: number;
  room_id?: number;
  school_id: number;
  created_at?: string;
  room?: {
    id: number;
    name: string;
    code: string;
    school_id: number;
  };
  mentor?: {
    name: string;
    phone: string;
    username: string;
    identifier: string;
    verified: boolean;
    role: string;
    mentor_id?: string | null;
    counselor_id?: string | null;
    room_id?: number | null;
    school_id: number;
    created_at?: string;
  };
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

// Interface untuk response API dashboard teacher
export interface DashboardTeacherResponse {
  success: boolean;
  message: string;
  data: {
    student_count: number;
    mood_today_count: number;
    mood_secure_count: number;
    mood_insecure_count: number;
  };
}

// Interface untuk response API dashboard counselor
export interface DashboardCounselorResponse {
  success: boolean;
  message: string;
  data: {
    student_count: number;
    report_today_count: number;
    meet_today_count: number;
    sharing_today_count: number;
  };
}

export interface CreateReportResponse {
  success: boolean;
  message: string;
  data: Report;
}

// Interface untuk response API dashboard admin
export interface DashboardAdminResponse {
  success: boolean;
  message: string;
  data: {
    users_count: number;
    content_count: number;
    content_today_count: number;
  };
}

// Interface untuk response API dashboard latest content
export interface DashboardLatestContentResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    created_at: string;
    type: "video" | "article" | "quote";
  }[];
}

// Interface untuk response API dashboard latest user
export interface DashboardLatestUserResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    phone: string;
    username: string;
    identifier: string;
    verified: boolean;
    role: string;
    created_at: string;
  }[];
}

// Interface untuk response API dashboard user
export interface DashboardUserResponse {
  success: boolean;
  message: string;
  data: User[];
}

// Tag API types
export interface Tag {
  id: number;
  title: string;
}

export interface TagResponse {
  success: boolean;
  message: string;
  data: Tag[];
}

// Article Detail API types
export interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  content: string;
  tags: Tag[];
}

export interface ArticleDetailResponse {
  success: boolean;
  message: string;
  data: ArticleDetail;
}

// Content API types
export interface ContentTag {
  id: number;
  title: string;
}

export interface ContentArticle {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  content: string;
  tags: ContentTag[];
}

export interface ContentVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  channel: string;
  views: number;
  video_id: string;
  tags: ContentTag[];
}

export type ContentItem = ContentArticle | ContentVideo;

export interface ContentResponse {
  success: boolean;
  message: string;
  data: ContentItem[];
}

// Interface untuk response API dashboard content
export interface DashboardContentItem {
  ids: string;
  title: string;
  type: "article" | "video" | "quote";
  created_at: string;
}

export interface DashboardContentResponse {
  success: boolean;
  message: string;
  data: DashboardContentItem[];
}

// Interface untuk request update artikel
export interface UpdateArticleRequest {
  title: string;
  description: string;
  content: string;
  tags: number[];
  thumbnail?: File;
}

// Interface untuk response update artikel
export interface UpdateArticleResponse {
  success: boolean;
  message: string;
  data: ArticleDetail;
}

// Interface untuk response API dashboard mood trends
export interface DashboardMoodTrendsResponse {
  success: boolean;
  message: string;
  data: Record<string, {
    status: string;
    total: number;
  }>;
}

// Interface untuk response API dashboard headteacher
export interface DashboardHeadTeacherResponse {
  success: boolean;
  message: string;
  data: {
    student_count: number;
    teacher_count: number;
    counselor_count: number;
    room_count: number;
  };
}

