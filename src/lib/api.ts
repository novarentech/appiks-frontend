import { getSession } from "next-auth/react";
import { MoodRecordResponse, BulkTemplateResponse, BulkImportResponse, DashboardReportGraphResponse, DashboardMoodGraphResponse, DashboardStudentResponse, MoodPatternResponse, SharingListResponse, SharingDetailResponse, SharingReplyResponse, SharingCreateResponse, ReportListResponse, ReportConfirmRequest, ReportConfirmResponse, ReportCloseRequest, ReportCloseResponse, ReportRescheduleRequest, ReportRescheduleResponse, ReportCancelRequest, ReportCancelResponse, UserListResponse, CreateReportRequest, CreateReportResponse } from "@/types/api";
import { API_BASE_URL } from "@/lib/config";

/**
 * Get CSRF token from cookie
 */
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const match = document.cookie.match(new RegExp('(^| )csrf_token=([^;]+)'));
  return match ? match[2] : null;
}

/**
 * Add CSRF token to headers
 */
export function addCSRFToken(headers: HeadersInit = {}): HeadersInit {
  const csrfToken = getCSRFToken();
  
  if (csrfToken) {
    return {
      ...headers,
      "x-csrf-token": csrfToken,
    };
  }
  
  return headers;
}

/**
 * Make authenticated API call
 */
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getSession();

  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.user.token}`,
    ...options.headers,
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

/**
 * GET request with authentication
 */
export async function authGet(endpoint: string) {
  const response = await authenticatedFetch(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * POST request with authentication
 */
export async function authPost(endpoint: string, data: unknown) {
  const response = await authenticatedFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * PUT request with authentication
 */
export async function authPut(endpoint: string, data: unknown) {
  const response = await authenticatedFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`PUT ${endpoint} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * DELETE request with authentication
 */
export async function authDelete(endpoint: string) {
  const response = await authenticatedFetch(endpoint, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Get bulk import template
 */
export async function getBulkImportTemplate(): Promise<BulkTemplateResponse> {
  const response = await authenticatedFetch(`/user/bulk/template`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`GET /user/bulk/template failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Upload bulk import file
 */
export async function uploadBulkImportFile(file: File): Promise<BulkImportResponse> {
  const session = await getSession();

  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/user/bulk`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user.token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`POST /user/bulk failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Get dashboard report graph data
 */
export async function getDashboardReportGraph(): Promise<DashboardReportGraphResponse> {
  const response = await authenticatedFetch(`/dashboard/report-graph`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`GET /api/dashboard/report-graph failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Get dashboard mood graph data
 */
export async function getDashboardMoodGraph(): Promise<DashboardMoodGraphResponse> {
  const response = await authGet("/dashboard/mood-graph");
  return response;
}

/**
 * Get dashboard student data
 */
export async function getDashboardStudent(): Promise<DashboardStudentResponse> {
  const response = await authGet("/dashboard/student");
  return response;
}

/**
 * Record mood data
 */
export async function recordMood(status: string): Promise<MoodRecordResponse> {
  const headers = addCSRFToken({
    "Content-Type": "application/json",
  });

  const response = await fetch("/api/mood-record", {
    method: "POST",
    headers,
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to record mood: ${response.status} - ${errorData}`);
  }

  return response.json();
}

/**
 * Get mood pattern data for a user
 */
export async function getMoodPattern(username: string, type: "weekly" | "monthly"): Promise<MoodPatternResponse> {
  const response = await authGet(`/mood-record/pattern/${username}/${type}`);
  return response;
}

/**
 * Get all sharing/curhat data
 */
export async function getSharingList(): Promise<SharingListResponse> {
  const response = await authGet("/sharing");
  return response;
}

/**
 * Get sharing/curhat detail by ID
 */
export async function getSharingDetail(id: number): Promise<SharingDetailResponse> {
  const response = await authGet(`/sharing/${id}`);
  return response;
}

/**
 * Create new sharing/curhat
 */
export async function createSharing(data: { title: string; description: string }): Promise<SharingCreateResponse> {
  const response = await authPost("/sharing", data);
  return response;
}

/**
 * Reply to sharing/curhat
 */
export async function replySharing(id: number, text: string): Promise<SharingReplyResponse> {
  const response = await authPatch(`/sharing/reply/${id}`, { text });
  return response;
}

/**
 * PATCH request with authentication
 */
export async function authPatch(endpoint: string, data: unknown) {
  const response = await authenticatedFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`PATCH ${endpoint} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Get all counseling schedule reports
 */
export async function getReportList(): Promise<ReportListResponse> {
  const response = await authGet("/report");
  return response;
}

/**
 * Confirm a counseling schedule report
 */
export async function confirmReport(id: number, data: ReportConfirmRequest): Promise<ReportConfirmResponse> {
  const response = await authPatch(`/report/confirm/${id}`, data);
  return response;
}

/**
 * Close/Complete a counseling schedule report
 */
export async function closeReport(id: number, data: ReportCloseRequest): Promise<ReportCloseResponse> {
  const response = await authPatch(`/report/close/${id}`, data);
  return response;
}

/**
 * Reschedule a counseling report meeting
 */
export async function rescheduleReport(id: number, data: ReportRescheduleRequest): Promise<ReportRescheduleResponse> {
  const response = await authPatch(`/report/reschedule/${id}`, data);
  return response;
}

/**
 * Cancel a counseling schedule report
 */
export async function cancelReport(id: number, data: ReportCancelRequest): Promise<ReportCancelResponse> {
  const response = await authPatch(`/report/cancel/${id}`, data);
  return response;
}

/**
 * Get users by type
 */
export async function getUsersByType(type: string): Promise<UserListResponse> {
  const response = await authGet(`/dashboard/users/type/${type}`);
  return response;
}

/**
 * Create a new counseling schedule report
 */
export async function createReport(data: CreateReportRequest): Promise<CreateReportResponse> {
  const response = await authPost("/report", data);
  return response;
}
