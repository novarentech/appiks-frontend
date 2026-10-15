"use client";

import { useAuth } from "@/hooks/useAuth";
import NavbarUserDashboard from "@/components/layout/DashboardNavbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import DynamicBreadcrumb from "@/components/layout/DynamicBreadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SafetyCheckProvider } from "@/contexts/SafetyCheckContext";
import { SafetyCheckDialogWrapper } from "@/components/dialogs/SafetyCheckDialogWrapper";
import { HeadTeacherNotificationPopover } from "@/components/dashboard/HeadTeacherNotificationPopover";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

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

  // Student menggunakan layout existing dengan navbar
  if (user?.role === "student") {
    return (
      <SafetyCheckProvider>
        <SafetyCheckDialogWrapper>
          <NavbarUserDashboard />
          <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
            {children}
          </div>
        </SafetyCheckDialogWrapper>
      </SafetyCheckProvider>
    );
  }

  // Role lain menggunakan sidebar layout
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b sticky top-0 bg-white z-10 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
          <div className="flex items-center gap-2">
            {user?.role === "headteacher" && <HeadTeacherNotificationPopover />}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
