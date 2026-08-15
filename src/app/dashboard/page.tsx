"use client";

import { useAuth } from "@/hooks/useAuth";
import { StudentRedirectGuard } from "@/components/auth/guards/StudentRedirectGuard";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { CounselorDashboard } from "@/components/dashboard/CounselorDashboard";
import { HeadTeacherDashboard } from "@/components/dashboard/HeadTeacherDashboard";
import { SuperDashboard } from "@/components/dashboard/SuperDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { PsychologistDashboard } from "@/components/dashboard/PsychologistDashboard";

export default function DashboardPage() {
  return (
    <RoleGuard permissionType="dashboard">
      <DashboardContent />
    </RoleGuard>
  );
}

function DashboardContent() {
  const { user } = useAuth();

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
      case "psychologist":
        return <PsychologistDashboard />;
      case "super":
        return <SuperDashboard />;
      default:
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Unknown Role</h1>
            <p className="text-gray-600 mt-2">
              Your role <span className="font-semibold">{user?.role}</span> is not recognized. Please
              contact administrator.
            </p>
          </div>
        );
    }
  };

  // Student menggunakan guard khusus untuk checkin redirect
  if (user?.role === "student") {
    return <StudentRedirectGuard>{renderDashboard()}</StudentRedirectGuard>;
  }

  // Role lain langsung render dashboard
  return renderDashboard();
}
