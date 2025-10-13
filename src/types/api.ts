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

// Interface untuk Room API response
export interface RoomData {
  id: number;
  name: string;
  level: string;
  code: string;
  school_id: number;
  mention: string;
}

export interface RoomResponse {
  success: boolean;
  message: string;
  data: RoomData[];
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
  role: "teacher" | "counselor" | "super" | "headteacher" | "admin" | "student"; // More specific
  mentor_id?: number;
  counselor_id?: number;
  room_id?: number;
  school_id: number;
  created_at?: string;
  school?: {
    id: number;
    name: string;
    address: string;
    phone: number;
    email: string;
    district: string;
    city: string;
    province: string;
  };
  room?: {
    id: number;
    name: string;
    level?: string; // Add level property
    code: string;
    school_id: number;
  };
  mentor?: {
    id: string;
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
  data: Record<
    string,
    {
      status: string;
      total: number;
    }
  >;
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

// Create Quote API types
export interface CreateQuoteRequest {
  text: string;
  author: string;
  type: "secure" | "insecure" | "daily";
}

export interface CreateQuoteResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    text: string;
    author: string;
    type: string;
    created_at: string;
  };
}

// Create Video API types
export interface CreateVideoRequest {
  video_id: string;
  tags: number[];
}

export interface CreateVideoResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    video_id: string;
    created_at: string;
  };
}

// Create Article API types
export interface CreateArticleRequest {
  title: string;
  description: string;
  content: string;
  tags: string[];
  thumbnail?: File;
}

export interface CreateArticleResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    description: string;
    content: string;
    thumbnail?: string;
    created_at: string;
  };
}

// Delete Quote API types
export interface DeleteQuoteResponse {
  success: boolean;
  message: string;
}

// Delete Video API types
export interface DeleteVideoResponse {
  success: boolean;
  message: string;
}

// Delete Article API types
export interface DeleteArticleResponse {
  success: boolean;
  message: string;
}

// Content Statistics API types
export interface ContentStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    quote_count: number;
    article_count: number;
    video_count: number;
  };
}

// Room Student Count API types
export interface RoomStudentCountResponse {
  success: boolean;
  message: string;
  data: {
    student: number;
    room: number;
  };
}

// Update Room API types
export interface UpdateRoomRequest {
  name: string;
  level: "X" | "XI" | "XII";
}

export interface UpdateRoomResponse {
  success: boolean;
  message: string;
  data: RoomData;
}

// Delete Room API types
export interface DeleteRoomResponse {
  success: boolean;
  message: string;
}

// Location API types
export interface ProvinceResponse {
  success: boolean;
  message: string;
  data: string[];
}

export interface CityResponse {
  success: boolean;
  message: string;
  data: string[];
}

export interface DistrictResponse {
  success: boolean;
  message: string;
  data: string[];
}

export interface VillageResponse {
  success: boolean;
  message: string;
  data: string[];
}

// School API types
export interface School {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  province: string;
}

export interface SchoolResponse {
  success: boolean;
  message: string;
  data: School[];
}

export interface SchoolDetailResponse {
  success: boolean;
  message: string;
  data: School;
}

export interface CreateSchoolRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  province: string;
}

export interface UpdateSchoolRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  province: string;
}

export interface DeleteSchoolResponse {
  success: boolean;
  message: string;
  data: School;
}

// School Mood Trends API types
export interface SchoolMoodTrendItem {
  recorded: string;
  status: string;
  total: number;
}

export interface SchoolMoodTrendsStudent {
  id: number;
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
  created_at: string;
}

export interface SchoolMoodTrendsSchool {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  province: string;
  students: SchoolMoodTrendsStudent[];
}

export interface SchoolMoodTrendsData {
  moods: SchoolMoodTrendItem[];
  school: SchoolMoodTrendsSchool;
}

export interface SchoolMoodTrendsResponse {
  success: boolean;
  message: string;
  data: SchoolMoodTrendsData;
}

// School Rooms API types
export interface SchoolRoom {
  id: number;
  name: string;
  level: string;
  code: string;
  school_id: number;
  created_at: string;
  students_count: number;
  school: {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    district: string;
    city: string;
    province: string;
  };
  mention: string;
}

export interface SchoolRoomsResponse {
  success: boolean;
  message: string;
  data: SchoolRoom[];
}

// Interface for room detail by code
export interface RoomStudent {
  id: number;
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  created_at: string;
  mentor: {
    id: number;
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
    created_at: string;
  };
}

export interface RoomDetailSchool {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  province: string;
}

export interface RoomDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    level: string;
    code: string;
    school_id: number;
    created_at: string;
    students_count: number;
    students: RoomStudent[];
    school: RoomDetailSchool;
    mention: string;
  };
}

// Student Sharing API types
export interface StudentSharingItem {
  id: number;
  user_id: number;
  title: string;
  description: string;
  reply: string | null;
  replied_at: string | null;
  replied_by: string | null;
  priority: "tinggi" | "rendah";
  created_at: string;
}

export interface StudentSharingResponse {
  success: boolean;
  message: string;
  data: StudentSharingItem[];
}

// Student Report API types
export interface StudentReportCounselor {
  id: number;
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  created_at: string;
}

export interface StudentReportItem {
  id: number;
  user_id: number;
  counselor_id: number;
  topic: string;
  room: string;
  date: string;
  time: string;
  status: "selesai" | "dibatalkan" | "disetujui" | "menunggu" | "dijadwalkan";
  priority: "tinggi" | "rendah";
  notes: string;
  result: string;
  created_at: string;
  counselor: StudentReportCounselor;
}

export interface StudentReportResponse {
  success: boolean;
  message: string;
  data: StudentReportItem[];
}

// Dashboard Report Count API types
export interface DashboardReportCountResponse {
  success: boolean;
  message: string;
  data: {
    dijadwalkan: number;
    menunggu: number;
    selesai: number;
    dibatalkan: number;
  };
}

// Dashboard Sharing Count API types
export interface DashboardSharingCountResponse {
  success: boolean;
  message: string;
  data: {
    received: string;
    replied: string;
    total: string;
  };
}

// Mood Record Export API types
export interface MoodRecordExportResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

// Student Mood Record Export API types
export interface StudentMoodExportResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

// Self Help API types

// Content structure for Gratitude Journal
export interface GratitudeJournalContent {
  progress: string[];
  achievement: string[];
  apreciation: string;
}

// Content structure for Daily Journaling
export interface DailyJournalingContent {
  mind: string;
  story: string;
  category: string;
  emotions: string[];
}

// Content structure for Grounding Technique
export interface GroundingTechniqueContent {
  one: string;
  two: string[];
  three: string[];
  four: string[];
  five: string[];
}

// Content structure for Sensory Relaxation
export interface SensoryRelaxationContent {
  activity: string[];
  reflection: string;
}

// Union type for all possible content types
export type SelfHelpContent = 
  | GratitudeJournalContent 
  | DailyJournalingContent 
  | GroundingTechniqueContent 
  | SensoryRelaxationContent;

export interface SelfHelpItem {
  id: number;
  type: "Daily Journaling" | "Gratitude Journal" | "Grounding Technique" | "Sensory Relaxation";
  content: SelfHelpContent;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface SelfHelpResponse {
  success: boolean;
  message: string;
  data: SelfHelpItem[];
}
