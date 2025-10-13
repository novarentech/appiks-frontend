import { getSession } from "next-auth/react";
import {
  MoodRecordResponse,
  BulkTemplateResponse,
  BulkImportResponse,
  DashboardReportGraphResponse,
  DashboardMoodGraphResponse,
  DashboardStudentResponse,
  MoodPatternResponse,
  SharingListResponse,
  SharingDetailResponse,
  SharingReplyResponse,
  SharingCreateResponse,
  ReportListResponse,
  ReportConfirmRequest,
  ReportConfirmResponse,
  ReportCloseRequest,
  ReportCloseResponse,
  ReportRescheduleRequest,
  ReportRescheduleResponse,
  ReportCancelRequest,
  ReportCancelResponse,
  UserListResponse,
  CreateReportRequest,
  CreateReportResponse,
  DashboardMoodTrendsResponse,
  DashboardTeacherResponse,
  DashboardCounselorResponse,
  DashboardHeadTeacherResponse,
  DashboardUserResponse,
  DashboardAdminResponse,
  DashboardLatestContentResponse,
  DashboardLatestUserResponse,
  ContentResponse,
  TagResponse,
  ArticleDetailResponse,
  DashboardContentResponse,
  UpdateArticleRequest,
  UpdateArticleResponse,
  CreateQuoteRequest,
  CreateQuoteResponse,
  CreateVideoRequest,
  CreateVideoResponse,
  CreateArticleRequest,
  CreateArticleResponse,
  DeleteQuoteResponse,
  DeleteVideoResponse,
  DeleteArticleResponse,
  ContentStatisticsResponse,
  ProvinceResponse,
  CityResponse,
  DistrictResponse,
  VillageResponse,
  SchoolResponse,
  SchoolDetailResponse,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  DeleteSchoolResponse,
  SchoolMoodTrendsResponse,
  SchoolRoomsResponse,
  RoomDetailResponse,
  StudentSharingResponse,
  StudentReportResponse,
  MoodRecordExportResponse,
  StudentMoodExportResponse,
  SelfHelpResponse,
} from "@/types/api";
import { RoomResponse, RoomStudentCountResponse } from "@/types/api";
import { API_BASE_URL } from "@/lib/config";
import { Bell, CheckCircle } from "lucide-react";
import { Notification, CurhatNotification, CounselingNotification } from "@/types/notifications";

/**
 * Get CSRF token from cookie
 */
export function getCSRFToken(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )csrf_token=([^;]+)"));
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
    throw new Error(
      `GET /user/bulk/template failed with status ${response.status}`
    );
  }

  return response.json();
}

/**
 * Get all users for account management
 */
export async function getAllUsers(): Promise<DashboardUserResponse> {
  const response = await authGet("/dashboard/users");
  return response;
}

/**
 * Upload bulk import file
 */
export async function uploadBulkImportFile(
  file: File
): Promise<BulkImportResponse> {
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
    throw new Error(
      `GET /dashboard/report-graph failed with status ${response.status}`
    );
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
export async function getMoodPattern(
  username: string,
  type: "weekly" | "monthly"
): Promise<MoodPatternResponse> {
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
export async function getSharingDetail(
  id: number
): Promise<SharingDetailResponse> {
  const response = await authGet(`/sharing/${id}`);
  return response;
}

/**
 * Create new sharing/curhat
 */
export async function createSharing(data: {
  title: string;
  description: string;
}): Promise<SharingCreateResponse> {
  const response = await authPost("/sharing", data);
  return response;
}

/**
 * Reply to sharing/curhat
 */
export async function replySharing(
  id: number,
  text: string
): Promise<SharingReplyResponse> {
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
export async function confirmReport(
  id: number,
  data: ReportConfirmRequest
): Promise<ReportConfirmResponse> {
  const response = await authPatch(`/report/confirm/${id}`, data);
  return response;
}

/**
 * Close/Complete a counseling schedule report
 */
export async function closeReport(
  id: number,
  data: ReportCloseRequest
): Promise<ReportCloseResponse> {
  const response = await authPatch(`/report/close/${id}`, data);
  return response;
}

/**
 * Reschedule a counseling report meeting
 */
export async function rescheduleReport(
  id: number,
  data: ReportRescheduleRequest
): Promise<ReportRescheduleResponse> {
  const response = await authPatch(`/report/reschedule/${id}`, data);
  return response;
}

/**
 * Cancel a counseling schedule report
 */
export async function cancelReport(
  id: number,
  data: ReportCancelRequest
): Promise<ReportCancelResponse> {
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
export async function createReport(
  data: CreateReportRequest
): Promise<CreateReportResponse> {
  const response = await authPost("/report", data);
  return response;
}

/**
 * Get dashboard mood trends data
 */
export async function getDashboardMoodTrends(): Promise<DashboardMoodTrendsResponse> {
  const response = await authGet("/dashboard/mood-trends");
  return response;
}

/**
 * Get dashboard teacher data
 */
export async function getDashboardTeacher(): Promise<DashboardTeacherResponse> {
  const response = await authGet("/dashboard/teacher");
  return response;
}

/**
 * Get dashboard counselor data
 */
export async function getDashboardCounselor(): Promise<DashboardCounselorResponse> {
  const response = await authGet("/dashboard/counselor");
  return response;
}

/**
 * Get dashboard headteacher data
 */
export async function getDashboardHeadTeacher(): Promise<DashboardHeadTeacherResponse> {
  const response = await authGet("/dashboard/headteacher");
  return response;
}

/**
 * Get dashboard super data
 */
export async function getDashboardSuper(): Promise<{
  success: boolean;
  message: string;
  data: {
    school_count: number;
    admin_count: number;
  };
}> {
  const response = await authGet("/dashboard/super");
  return response;
}

/**
 * Get dashboard user data
 */
export async function getDashboardUsers(): Promise<DashboardUserResponse> {
  const response = await authGet("/dashboard/users");
  return response;
}

/**
 * Get dashboard admin data
 */
export async function getDashboardAdmin(): Promise<DashboardAdminResponse> {
  const response = await authGet("/dashboard/admin");
  return response;
}

/**
 * Get dashboard latest content data
 */
export async function getDashboardLatestContent(): Promise<DashboardLatestContentResponse> {
  const response = await authGet("/dashboard/latest-content");
  return response;
}

/**
 * Get dashboard latest user data
 */
export async function getDashboardLatestUser(): Promise<DashboardLatestUserResponse> {
  const response = await authGet("/dashboard/latest-user");
  return response;
}

/**
 * Get content data (articles and videos)
 */
export async function getContent(): Promise<ContentResponse> {
  const response = await authGet("/content");
  return response;
}

/**
 * Get tags data
 */
export async function getTags(): Promise<TagResponse> {
  const response = await authGet("/tag");
  return response;
}

/**
 * Get article detail by slug
 */
export async function getArticleDetail(
  slug: string
): Promise<ArticleDetailResponse> {
  const response = await authGet(`/article/${slug}`);
  return response;
}

/**
 * Get article detail by ID
 */
export async function getArticleDetailById(
  id: string
): Promise<ArticleDetailResponse> {
  const response = await authGet(`/article/${id}`);
  return response;
}

/**
 * Get dashboard content data
 */
export async function getDashboardContent(): Promise<DashboardContentResponse> {
  const response = await authGet("/dashboard/content");
  return response;
}

/**
 * Update article by ID
 */
export async function updateArticle(
  id: string,
  data: UpdateArticleRequest
): Promise<UpdateArticleResponse> {
  // Convert string ID to number as API expects integer
  const articleId = parseInt(id, 10);

  if (isNaN(articleId)) {
    throw new Error("Invalid article ID");
  }

  const session = await getSession();

  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  // Check if thumbnail is a File object
  if (data.thumbnail instanceof File) {
    // Use FormData for file upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", data.content);

    // Add tags as JSON string
    formData.append("tags", JSON.stringify(data.tags));

    // Add file
    formData.append("thumbnail", data.thumbnail);

    const response = await fetch(
      `${API_BASE_URL}/article-update/${articleId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `POST /article-update/${articleId} failed with status ${response.status}`
      );
    }

    return response.json();
  } else {
    // Use JSON for non-file uploads
    const updateData = {
      title: data.title,
      description: data.description,
      content: data.content,
      tags: data.tags,
      ...(data.thumbnail ? { thumbnail: data.thumbnail } : {}),
    };

    // Use authPost to send data to API
    const response = await authPost(`/article-update/${articleId}`, updateData);

    return response;
  }
}

// Create quote
export async function createQuote(
  data: CreateQuoteRequest
): Promise<CreateQuoteResponse> {
  const response = await authPost("/quote", data);
  return response;
}

// Create video
export async function createVideo(
  data: CreateVideoRequest
): Promise<CreateVideoResponse> {
  const response = await authPost("/video", data);
  return response;
}

// Create article with file upload support
export async function createArticle(
  data: CreateArticleRequest
): Promise<CreateArticleResponse> {
  const session = await getSession();

  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("content", data.content);
  formData.append("tags", JSON.stringify(data.tags));

  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }

  const response = await fetch(`${API_BASE_URL}/articles`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user.token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`POST /articles failed with status ${response.status}`);
  }

  return response.json();
}
// Delete quote
export async function deleteQuote(id: string): Promise<DeleteQuoteResponse> {
  const session = await getSession();
  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(`${API_BASE_URL}/quote/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.user.token}` },
  });

  if (!response.ok) {
    throw new Error(
      `DELETE /quote/${id} failed with status ${response.status}`
    );
  }

  // Handle JSON response with success: true
  const data = await response.json();

  if (data.success) {
    return {
      success: true,
      message: data.message || "Quote berhasil dihapus",
    };
  } else {
    throw new Error(data.message || "Gagal menghapus quote");
  }
}

// Delete video
export async function deleteVideo(id: string): Promise<DeleteVideoResponse> {
  const session = await getSession();
  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(`${API_BASE_URL}/video/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.user.token}` },
  });

  if (!response.ok) {
    throw new Error(
      `DELETE /video/${id} failed with status ${response.status}`
    );
  }

  // Handle JSON response with success: true
  const data = await response.json();

  if (data.success) {
    return {
      success: true,
      message: data.message || "Video berhasil dihapus",
    };
  } else {
    throw new Error(data.message || "Gagal menghapus video");
  }
}

// Delete article
export async function deleteArticle(
  id: string
): Promise<DeleteArticleResponse> {
  const session = await getSession();
  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.user.token}` },
  });

  if (!response.ok) {
    throw new Error(
      `DELETE /articles/${id} failed with status ${response.status}`
    );
  }

  // Handle JSON response with success: true
  const data = await response.json();

  if (data.success) {
    return {
      success: true,
      message: data.message || "Artikel berhasil dihapus",
    };
  } else {
    throw new Error(data.message || "Gagal menghapus artikel");
  }
}

/**
 * Get content statistics data
 */
export async function getContentStatistics(): Promise<ContentStatisticsResponse> {
  const response = await authGet("/dashboard/content-statistics");
  return response;
}

/**
 * Get rooms/classes data
 */
export async function getRooms(): Promise<RoomResponse> {
  const response = await authGet("/room");
  return response;
}

/**
 * Create a new room/class
 */
export async function createRoom(data: {
  name: string;
  level: string;
}): Promise<RoomResponse> {
  const response = await authPost("/room", data);
  return response;
}

/**
 * Update a room/class
 */
export async function updateRoom(
  roomId: number,
  data: {
    name: string;
    level: string;
  }
): Promise<RoomResponse> {
  const response = await authPut(`/room/${roomId}`, data);
  return response;
}

/**
 * Delete a room/class
 */
export async function deleteRoom(roomId: number): Promise<{ success: boolean; message: string }> {
  const response = await authDelete(`/room/${roomId}`);
  return response;
}

/**
 * Delete user by username
 */
export async function deleteUser(username: string): Promise<{ success: boolean; message: string }> {
  const response = await authDelete(`/user/${username}`);
  return response;
}


/**
 * Get room and student count data
 */
export async function getRoomStudentCount(): Promise<RoomStudentCountResponse> {
  const response = await authGet("/room-student-count");
  return response;
}

/**
 * Create new user
 */
export async function createUser(userData: {
  name: string;
  username: string;
  identifier: string;
  phone: string;
  role: "teacher" | "headteacher" | "counselor";
  password: string;
}): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await authPost("/dashboard/users", userData);
  return response;
}

/**
 * Location API functions for Indonesian administrative data
 */

/**
 * Get all provinces
 */
export async function getProvinces(): Promise<ProvinceResponse> {
  const response = await fetch(`${API_BASE_URL}/province`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`GET /province failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Get all cities by province name
 */
export async function getCitiesByProvince(province: string): Promise<CityResponse> {
  const encodedProvince = encodeURIComponent(province);
  const response = await fetch(`${API_BASE_URL}/city/${encodedProvince}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`GET /city/${province} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Get all districts by city name
 */
export async function getDistrictsByCity(city: string): Promise<DistrictResponse> {
  const encodedCity = encodeURIComponent(city);
  const response = await fetch(`${API_BASE_URL}/district/${encodedCity}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`GET /district/${city} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Get all villages by district name
 */
export async function getVillagesByDistrict(district: string): Promise<VillageResponse> {
  const encodedDistrict = encodeURIComponent(district);
  const response = await fetch(`${API_BASE_URL}/village/${encodedDistrict}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`GET /village/${district} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * School API functions for school management
 */

/**
 * Get all schools
 */
export async function getSchools(): Promise<SchoolResponse> {
  const response = await authGet("/school");
  return response;
}

/**
 * Create a new school
 */
export async function createSchool(data: CreateSchoolRequest): Promise<SchoolDetailResponse> {
  const response = await authPost("/school", data);
  return response;
}

/**
 * Update a school by ID
 */
export async function updateSchool(schoolId: number, data: UpdateSchoolRequest): Promise<SchoolDetailResponse> {
  const response = await authPut(`/school/${schoolId}`, data);
  return response;
}

/**
 * Delete a school by ID
 */
export async function deleteSchool(schoolId: number): Promise<DeleteSchoolResponse> {
  const response = await authDelete(`/school/${schoolId}`);
  return response;
}

/**
 * Get school mood trends data
 */
export async function getSchoolMoodTrends(
  school: string,
  type: "weekly" | "monthly"
): Promise<SchoolMoodTrendsResponse> {
  const response = await authGet(`/mood-trends/${school}/${type}`);
  return response;
}

/**
 * Get school rooms/classes data
 */
export async function getSchoolRooms(school: string): Promise<SchoolRoomsResponse> {
  const response = await authGet(`/room/school/${school}`);
  return response;
}

/**
 * Get room detail by code
 */
export async function getRoomByCode(code: string): Promise<RoomDetailResponse> {
  const response = await authGet(`/room/${code}`);
  return response;
}

/**
 * Create a new admin user
 */
export async function createAdmin(data: {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  school_id: number;
}): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await authPost("/user/admin", data);
  return response;
}

/**
 * Update a user
 */
export async function updateUser(username: string, userData: {
  username?: string;
  phone?: string;
  identifier?: string;
  room_id?: string;
  mentor_id?: string;
  name?: string;
  password?: string | null;
  school_id?: number;
}): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await authPatch(`/edit-user/${username}`, userData);
  return response;
}

/**
 * Get latest sharing/curhat notifications
 */
export async function getLatestSharingNotifications(): Promise<Notification[]> {
  const session = await getSession();

  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(`${API_BASE_URL}/notification/latest-sharing`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`GET /notification/latest-sharing failed with status ${response.status}`);
  }

  const apiResponse = await response.json();
  
  if (!apiResponse.success || !apiResponse.data) {
    return [];
  }

  // Transform API data to match Notification interface
  const notifications: CurhatNotification[] = apiResponse.data.map((item: {
    id: number;
    title: string;
    description: string;
    reply: string | null;
    replied_by: string | null;
    replied_at: string | null;
    created_at: string;
  }) => {
    const createdDate = new Date(item.created_at);
    const formattedDate = createdDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');

    // Determine status based on reply
    const status: "dibalas" | "dikirim" = item.reply ? "dibalas" : "dikirim";
    const statusText = item.reply ? "Dibalas" : "Dikirim";
    const statusColor = item.reply ? "blue" : "amber";

    return {
      id: item.id,
      type: "curhat" as const,
      title: "Status Curhatmu",
      description: item.title,
      teacher: item.replied_by || "System", // Since API doesn't provide teacher info
      date: formattedDate,
      status: status,
      statusText: statusText,
      statusColor: statusColor,
      borderColor: item.reply ? "border-blue-400" : "border-amber-400",
      icon: Bell,
      isNew: true, // Always show as new since user wants fresh data
      curhatDescription: item.description,
      reply: item.reply,
      replyDate: item.replied_at ? new Date(item.replied_at).toLocaleString('id-ID') : undefined,
    };
  });

  return notifications;
}

/**
 * Get mood record export URL for today
 */
export async function getMoodRecordExportToday(): Promise<MoodRecordExportResponse> {
  const response = await authGet("/mood_record/export/today");
  return response;
}

/**
 * Get student mood record export URL
 */
export async function getStudentMoodExport(username: string, type: "weekly" | "monthly"): Promise<StudentMoodExportResponse> {
  const response = await authGet(`/mood_record/export/${username}/${type}`);
  return response;
}

/**
 * Get student sharing/curhat data by username
 */
export async function getStudentSharingData(username: string): Promise<StudentSharingResponse> {
  const response = await authGet(`/sharing/student/${username}`);
  return response;
}

/**
 * Get student report/counseling data by username
 */
export async function getStudentReportData(username: string): Promise<StudentReportResponse> {
  const response = await authGet(`/report/student/${username}`);
  return response;
}

/**
 * Get dashboard report count data
 */
export async function getDashboardReportCount(): Promise<{
  success: boolean;
  message: string;
  data: {
    dijadwalkan: number;
    menunggu: number;
    selesai: number;
    dibatalkan: number;
  };
}> {
  const response = await authGet("/dashboard/report-count");
  return response;
}

/**
 * Get dashboard sharing count data
 */
export async function getDashboardSharingCount(): Promise<{
  success: boolean;
  message: string;
  data: {
    received: string;
    replied: string;
    total: string;
  };
}> {
  const response = await authGet("/dashboard/sharing-count");
  return response;
}

/**
 * Get self-help data by type and username
 */
export async function getSelfHelpData(
  type: "Daily Journaling" | "Gratitude Journal" | "Grounding Technique" | "Sensory Relaxation",
  username: string
): Promise<SelfHelpResponse> {
  const encodedType = encodeURIComponent(type);
  const response = await authGet(`/self-help/${encodedType}/${username}`);
  return response;
}

/**
 * Get latest counseling schedule notifications
 */
export async function getLatestCounselingNotifications(): Promise<Notification[]> {
  const session = await getSession();

  if (!session?.user?.token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(`${API_BASE_URL}/notification/latest-report`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`GET /notification/latest-report failed with status ${response.status}`);
  }

  const apiResponse = await response.json();
  
  if (!apiResponse.success || !apiResponse.data) {
    return [];
  }

  // Transform API data to match Notification interface
  const notifications: CounselingNotification[] = apiResponse.data.map((item: {
    id: number;
    topic: string;
    room: string;
    date: string;
    time: string;
    status: string;
    priority: string;
    notes: string;
    result: string;
    created_at: string;
    counselor: {
      name: string;
    };
  }) => {
    const createdDate = new Date(item.created_at);
    const formattedDate = createdDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');

    // Map API status to notification status
    let status: "disetujui" | "dijadwal_ulang" | "selesai" | "dibatalkan" = "disetujui";
    let statusText = "Disetujui";
    let statusColor = "green";
    let borderColor = "border-green-400";

    switch (item.status) {
      case "selesai":
        status = "selesai";
        statusText = "Selesai";
        statusColor = "emerald";
        borderColor = "border-emerald-400";
        break;
      case "dijadwalkan":
        status = "disetujui";
        statusText = "Disetujui";
        statusColor = "green";
        borderColor = "border-green-400";
        break;
      case "dibatalkan":
        status = "dibatalkan";
        statusText = "Dibatalkan";
        statusColor = "red";
        borderColor = "border-red-400";
        break;
      case "dijadwal_ulang":
        status = "dijadwal_ulang";
        statusText = "Dijadwal Ulang";
        statusColor = "orange";
        borderColor = "border-orange-400";
        break;
    }

    return {
      id: item.id,
      type: "counseling" as const,
      title: "Jadwal Konseling",
      description: item.topic,
      teacher: item.counselor.name,
      date: formattedDate,
      time: item.time,
      room: item.room,
      status: status,
      statusText: statusText,
      statusColor: statusColor,
      borderColor: borderColor,
      icon: CheckCircle,
      isNew: true,
      notes: item.notes,
      noteDate: formattedDate,
    };
  });

  return notifications;
}
