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

