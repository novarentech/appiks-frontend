"use client";

import { useAuth } from "@/hooks/useAuth";
import { StudentRedirectGuard } from "@/components/auth/guards/StudentRedirectGuard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { CounselorDashboard } from "@/components/dashboard/CounselorDashboard";
import { HeadTeacherDashboard } from "@/components/dashboard/HeadTeacherDashboard";
import { SuperDashboard } from "@/components/dashboard/SuperDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export default function DashboardPage() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  // Role-based dashboard rendering
  const renderDashboard = () => {
    switch (user?.role) {
      case "student":
        return <StudentDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "counselor":
        return <CounselorDashboard />;
      case "headteacher":
        return <HeadTeacherDashboard />;
      case "super":
        return <SuperDashboard />;
      default:
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Unknown Role</h1>
            <p className="text-gray-600 mt-2">
              Your role &quot;{user?.role}&quot; is not recognized. Please
              contact administrator.
            </p>
          </div>
        );
    }
  };

  // Student menggunakan guard khusus
  if (user?.role === "student") {
    return <StudentRedirectGuard>{renderDashboard()}</StudentRedirectGuard>;
  }

  // Role lain langsung render dashboard
  return renderDashboard();
}
