import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  MessageCircle,
  Calendar,
  UserCog,
  BookText,
  ShieldUserIcon,
  University,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/features/profile/NavUser";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { FaChalkboardTeacher } from "react-icons/fa";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Type definitions
interface NavigationSubItem {
  title: string;
  url: string;
}

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items?: NavigationSubItem[];
}

// Role-based navigation configuration
const roleBasedNavigation: Record<string, NavigationItem[]> = {
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Kelola Akun",
      url: "/dashboard/account-management",
      icon: UserCog,
    },
    {
      title: "Kelola Konten",
      url: "/dashboard/content-management",
      icon: BookText,
    },
    {
      title: "Data Kelas",
      url: "/dashboard/class-data",
      icon: FaChalkboardTeacher,
    },
  ],
  teacher: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Data Siswa",
      url: "/dashboard/student-data",
      icon: Users,
    },
  ],
  counselor: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Data Siswa",
      url: "/dashboard/student-data",
      icon: Users,
    },
    {
      title: "Curhatan Siswa",
      url: "/dashboard/student-share",
      icon: MessageCircle,
    },
    {
      title: "Jadwal Konseling",
      url: "/dashboard/counseling-schedule",
      icon: Calendar,
    },
  ],
  headteacher: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Data Sekolah",
      url: "/dashboard/school-data",
      icon: UserCog,
    },
  ],
  super: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Data Sekolah",
      url: "/dashboard/school-monitor",
      icon: University,
    },
    {
      title: "Data TU",
      url: "/dashboard/admin-data",
      icon: ShieldUserIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const pathname = usePathname();
  const userRole = user?.role || "admin";

  const navigation: NavigationItem[] =
    roleBasedNavigation[userRole as keyof typeof roleBasedNavigation] ||
    roleBasedNavigation.admin;

  // Fungsi untuk mengecek apakah item navigasi aktif
  const isActive = (url: string) => {
    if (url === "#") return false;
    // Untuk dashboard, cek apakah path tepat /dashboard
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    // Untuk item lain, cek apakah pathname dimulai dengan url
    return pathname.startsWith(url);
  };

  // Fungsi untuk mengecek apakah sub-item navigasi aktif
  const isSubActive = (url: string) => {
    return pathname === url;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-gradient-to-tl from-violet-500 via-indigo-500 to-indigo-900 text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
                  <Image
                    src="/logo-white.webp"
                    width={100}
                    height={100}
                    className="max-h-8 max-w-8 dark:invert"
                    alt="Appiks Logo"
                  />
                </div>
                <span className="font-semibold text-xl text-indigo-500">
                  Appiks
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator orientation="horizontal" className="my-2" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);
              const hasActiveSubItem = item.items?.some((subItem) =>
                isSubActive(subItem.url)
              );

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "font-medium",
                        (active || hasActiveSubItem) &&
                          "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((subItem: NavigationSubItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a
                              href={subItem.url}
                              className={cn(
                                isSubActive(subItem.url) &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                            >
                              {subItem.title}
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
