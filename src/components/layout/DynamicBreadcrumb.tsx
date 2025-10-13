"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import {
  Home,
  Users,
  FileText,
  Calendar,
  Settings,
  User,
  BookOpen,
  BarChart3,
  MessageSquare,
} from "lucide-react";

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hapus '/dashboard' dari awal path
  const pathSegments = pathname
    .replace(/^\/dashboard\/?/, "")
    .split("/")
    .filter(Boolean);

  // Mapping untuk membuat nama yang lebih readable dari URL
  const segmentToName = (segment: string): string => {
    // Decode URL-encoded characters terlebih dahulu
    const decodedSegment = decodeURIComponent(segment);

    const nameMap: Record<string, string> = {
      "account-management": "Manajemen Akun",
      "content-management": "Manajemen Konten",
      "class-data": "Manajemen Kelas",
      "counseling-schedule": "Jadwal Konseling",
      "student-share": "Curhatan Siswa",
      "student-data": "Data Siswa",
      "mood-detail": "Detail Mood",
      "self-help-history": "Riwayat Self Help",
      counseling: "Konseling",
      schedule: "Jadwal",
      class: "Kelas",
      teacher: "Guru",
      student: "Siswa",
      "head-teacher": "Kepala Sekolah",
      counselor: "BK",
      admin: "Admin",
      super: "Super Admin",
      settings: "Pengaturan",
      profile: "Profil",
      reports: "Laporan",
      analytics: "Analitik",
    };

    return (
      nameMap[decodedSegment] ||
      decodedSegment.charAt(0).toUpperCase() +
        decodedSegment.slice(1).replace(/-/g, " ")
    );
  };

  // Mapping untuk ikon berdasarkan segment
  const segmentToIcon = (segment: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "account-management": <Users className="h-4 w-4" />,
      "content-management": <FileText className="h-4 w-4" />,
      counseling: <MessageSquare className="h-4 w-4" />,
      schedule: <Calendar className="h-4 w-4" />,
      class: <BookOpen className="h-4 w-4" />,
      settings: <Settings className="h-4 w-4" />,
      profile: <User className="h-4 w-4" />,
      reports: <BarChart3 className="h-4 w-4" />,
      analytics: <BarChart3 className="h-4 w-4" />,
    };

    return iconMap[segment] || null;
  };

  // Format nama role
  const formatRoleName = (role: string) => {
    const roleMap: Record<string, string> = {
      student: "Siswa",
      teacher: "Guru",
      headteacher: "Kepala Sekolah",
      counselor: "BK",
      admin: "TU",
      super: "Super Admin",
    };

    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Dashboard Home */}
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            {user?.role && <span>Dashboard {formatRoleName(user.role)}</span>}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Path segments */}
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = `/dashboard/${pathSegments
            .slice(0, index + 1)
            .join("/")}`;
          const icon = segmentToIcon(segment);

          // Check if this segment should be clickable
          const isMoodDetailWithUsername =
            segment === "mood-detail" &&
            index < pathSegments.length - 1 &&
            pathSegments[index + 1] !== "[username]";

          const isSelfHelpHistoryWithUsername =
            segment === "self-help-history" &&
            index < pathSegments.length - 1 &&
            pathSegments[index + 1] !== "[username]";

          const shouldBeClickable =
            !isLast && !isMoodDetailWithUsername && !isSelfHelpHistoryWithUsername;

          return (
            <Fragment key={segment}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {shouldBeClickable ? (
                  <BreadcrumbLink
                    href={href}
                    className="flex items-center gap-1"
                  >
                    {icon}
                    <span>{segmentToName(segment)}</span>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {icon}
                    <span>{segmentToName(segment)}</span>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
