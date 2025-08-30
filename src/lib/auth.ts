import jwt from "jsonwebtoken";
import {
  JWTPayload,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  UpdateProfileData,
  UpdateProfileResponse,
  UserProfileResponse,
} from "@/types/auth";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://appiks-be.disyfa.cloud/api";

/**
 * Decode JWT token and extract user information
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Verify JWT token (optional - if you have the secret)
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // If no secret is provided, just decode without verification
      return decodeJWT(token);
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Check if token is expired based on expiresIn string from API
 */
export function isTokenExpiredByDate(expiresIn: string): boolean {
  try {
    // Parse the date string from API
    const expiryDate = new Date(expiresIn);
    const currentDate = new Date();

    return currentDate >= expiryDate;
  } catch (error) {
    console.error("Error parsing expiry date:", error);
    return true;
  }
}

/**
 * Check if token needs refresh (expires in next 5 minutes)
 */
export function shouldRefreshToken(expiresIn: string): boolean {
  try {
    const expiryDate = new Date(expiresIn);
    const currentDate = new Date();
    const fiveMinutesFromNow = new Date(currentDate.getTime() + 5 * 60 * 1000); // 5 minutes

    return expiryDate <= fiveMinutesFromNow;
  } catch (error) {
    console.error("Error checking token refresh need:", error);
    return true;
  }
}

/**
 * Login API call
 */
export async function loginAPI(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Login API error:", error);
    throw new Error("Login failed");
  }
}

/**
 * Refresh token API call
 */
export async function refreshTokenAPI(token: string): Promise<RefreshResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RefreshResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Refresh token API error:", error);
    throw new Error("Token refresh failed");
  }
}

/**
 * Get user info from JWT token
 */
export function getUserFromToken(
  token: string
): { username: string; verified: boolean } | null {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    username: decoded.username,
    verified: decoded.verified,
  };
}

/**
 * Get token expiry info for debugging
 */
export function getTokenExpiryInfo(token: string, expiresIn: string) {
  const decoded = decodeJWT(token);
  const jwtExp = decoded?.exp ? new Date(decoded.exp * 1000) : null;
  const apiExp = new Date(expiresIn);
  const now = new Date();

  return {
    jwtExpiry: jwtExp,
    apiExpiry: apiExp,
    currentTime: now,
    isExpiredByJWT: jwtExp ? now >= jwtExp : true,
    isExpiredByAPI: now >= apiExp,
    shouldRefresh: shouldRefreshToken(expiresIn),
    timeUntilExpiry: apiExp.getTime() - now.getTime(),
  };
}

/**
 * Validate token and get detailed info
 */
export function validateToken(token: string) {
  if (!token) {
    return { isValid: false, error: "Token tidak ditemukan" };
  }

  try {
    const decoded = decodeJWT(token);
    if (!decoded) {
      return { isValid: false, error: "Token tidak dapat di-decode" };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return { isValid: false, error: "Token sudah kedaluwarsa" };
    }

    return {
      isValid: true,
      decoded,
      username: decoded.username,
      verified: decoded.verified,
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return { isValid: false, error: "Token format tidak valid" };
  }
}

/**
 * Update user profile API call
 */
export async function updateProfileAPI(
  profileData: UpdateProfileData,
  token: string
): Promise<UpdateProfileResponse> {
  try {
    console.log("📤 Making PATCH request to /profile with:", {
      profileData,
      tokenPrefix: token?.substring(0, 10) + "...",
      apiUrl: `${API_BASE_URL}/profile`,
    });

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    console.log("📥 API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data: UpdateProfileResponse = await response.json();
    console.log("✅ API Success response:", data);
    return data;
  } catch (error) {
    console.error("❌ Update profile API error:", error);
    throw new Error("Profile update failed");
  }
}

/**
 * Get user profile API call
 */
export async function getUserProfileAPI(
  token: string
): Promise<UserProfileResponse> {
  try {
    console.log("📤 Making GET request to /me with token:", {
      tokenPrefix: token?.substring(0, 10) + "...",
      apiUrl: `${API_BASE_URL}/me`,
    });

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📥 API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data: UserProfileResponse = await response.json();
    console.log("✅ User profile API Success response:", data);
    return data;
  } catch (error) {
    console.error("❌ Get user profile API error:", error);
    throw new Error("Failed to fetch user profile");
  }
}
