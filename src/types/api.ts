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

