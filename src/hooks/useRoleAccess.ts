"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Role types
export type AppRole =
  | "student"
  | "teacher"
  | "counselor"
  | "headteacher"
  | "admin"
  | "super";

// Role permissions configuration
export interface RolePermission {
  allowedRoles: AppRole[];
  redirectTo?: string;
  requireVerification?: boolean;
}

// Default role permissions for different page types
export const ROLE_PERMISSIONS: Record<string, RolePermission> = {
  // Public pages
  landing: {
    allowedRoles: [], // Empty means no auth required
  },
  login: {
    allowedRoles: [], // No auth required
  },

  // Student-only pages
  "student-only": {
    allowedRoles: ["student"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },

  "checkin": {
    allowedRoles: ["student"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },

  "article-detail": {
    allowedRoles: ["student", "admin"],
    requireVerification: true,
    redirectTo: "/login",
  },

  "video-player": {
    allowedRoles: ["student", "admin"],
    requireVerification: true,
    redirectTo: "/login",
  },

  // Admin-only pages
  "account-management": {
    allowedRoles: ["admin"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },
  
  "content-management": {
    allowedRoles: ["admin"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },

  // Admin + Teacher pages
  "class-data": {
    allowedRoles: ["admin"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },

  "student-data": {
    allowedRoles: ["teacher", "counselor"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },
  "school-data": {
    allowedRoles: ["headteacher"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },

  "counseling-schedule": {
    allowedRoles: ["counselor"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },
  "student-share": {
    allowedRoles: ["counselor"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },

  "school-management": {
    allowedRoles: ["super"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },
  "admin-management": {
    allowedRoles: ["super"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },
  "school-monitor": {
    allowedRoles: ["super"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },
  "self-help-history": {
    allowedRoles: ["teacher"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },

  // Dashboard (all roles but different rendering)
  dashboard: {
    allowedRoles: [
      "student",
      "teacher",
      "counselor",
      "headteacher",
      "admin",
      "super",
    ],
    requireVerification: true,
    redirectTo: "/login",
  },
  profile: {
    allowedRoles: [
      "student",
      "teacher",
      "counselor",
      "headteacher",
      "admin",
      "super",
    ],
    requireVerification: true,
    redirectTo: "/login",
  },
  "mood-detail": {
    allowedRoles: ["teacher", "counselor"],
    requireVerification: true,
    redirectTo: "/dashboard",
  },
};

export function useRoleAccess(permissionType: keyof typeof ROLE_PERMISSIONS) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const permission = ROLE_PERMISSIONS[permissionType];

  useEffect(() => {
    const checkAccess = async () => {
      if (status === "loading") return;

      // If no roles required (public page)
      if (permission.allowedRoles.length === 0) {
        setIsChecking(false);
        setHasAccess(true);
        return;
      }

      // Check if user is authenticated
      if (!session?.user) {
        if (permission.redirectTo) {
          router.replace(permission.redirectTo);
        } else {
          router.replace("/login");
        }
        return;
      }

      const { user } = session;

      // Check verification requirement
      if (permission.requireVerification && !user.verified) {
        router.replace("/fill-data");
        return;
      }

      // Map API role to AppRole
      const mapApiRoleToAppRole = (apiRole: string): AppRole => {
        switch (apiRole) {
          case "student":
            return "student";
          case "teacher":
            return "teacher";
          case "counselor":
            return "counselor";
          case "headteacher":
            return "headteacher";
          case "admin":
            return "admin";
          case "super":
            return "super";
          default:
            return "student"; // fallback
        }
      };

      const userRole = mapApiRoleToAppRole(user.role);

      // Check if user role is allowed
      const isRoleAllowed = permission.allowedRoles.includes(userRole);

      if (!isRoleAllowed) {
        if (permission.redirectTo) {
          router.replace(permission.redirectTo);
        } else {
          router.replace("/dashboard");
        }
        return;
      }

      // Special checks for certain pages
      if (permissionType === "checkin") {
        // Check if student can check-in
        try {
          const response = await fetch("/api/mood-record/check", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (!data.success || data.data?.can !== true) {
              router.replace("/dashboard");
              return;
            }
          } else {
            router.replace("/dashboard");
            return;
          }
        } catch (error) {
          console.error("Error checking mood record:", error);
          router.replace("/dashboard");
          return;
        }
      }

      setIsChecking(false);
      setHasAccess(true);
    };

    checkAccess();
  }, [session, status, router, permission, permissionType]);

  return {
    isChecking,
    hasAccess,
    user: session?.user,
    isLoading: status === "loading" || isChecking,
  };
}
