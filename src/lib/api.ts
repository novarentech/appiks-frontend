import { getSession } from "next-auth/react";
import { MoodRecordResponse, BulkTemplateResponse, BulkImportResponse, DashboardReportGraphResponse, DashboardMoodGraphResponse } from "@/types/api";
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
