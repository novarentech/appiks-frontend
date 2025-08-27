import { getSession } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://appiks-be.disyfa.cloud/api";

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
