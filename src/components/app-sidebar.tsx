import * as React from "react";
import {
  GalleryVerticalEnd,
  Home,
  Users,
  BookOpen,
  MessageCircle,
  Settings,
  BarChart3,
  UserCheck,
  Shield,
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
import { NavUser } from "./components/profile/nav-user";

// Role-based navigation configuration
const roleBasedNavigation = {
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "User Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/dashboard/users",
        },
        {
          title: "Students",
          url: "/dashboard/students",
        },
        {
          title: "Teachers",
          url: "/dashboard/teachers",
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/roles",
        },
      ],
    },
    {
      title: "School Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "School Settings",
          url: "/dashboard/school-settings",
        },
        {
          title: "Classes",
          url: "/dashboard/classes",
        },
        {
          title: "Curriculum",
          url: "/dashboard/curriculum",
        },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "User Reports",
          url: "/dashboard/reports/users",
        },
        {
          title: "Mental Health Overview",
          url: "/dashboard/reports/mental-health",
        },
        {
          title: "System Usage",
          url: "/dashboard/reports/usage",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
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
      url: "/dashboard/data-siswa",
      icon: Users,
    },
    {
      title: "My Students",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Class Overview",
          url: "/dashboard/my-students",
        },
        {
          title: "Mood Tracking",
          url: "/dashboard/student-moods",
        },
        {
          title: "Student Progress",
          url: "/dashboard/student-progress",
        },
      ],
    },
    {
      title: "Classes",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "My Classes",
          url: "/dashboard/classes",
        },
        {
          title: "Lesson Plans",
          url: "/dashboard/lessons",
        },
        {
          title: "Assignments",
          url: "/dashboard/assignments",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Class Analytics",
          url: "/dashboard/class-analytics",
        },
        {
          title: "Student Reports",
          url: "/dashboard/student-reports",
        },
      ],
    },
    {
      title: "Communication",
      url: "/dashboard/messages",
      icon: MessageCircle,
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
      url: "/dashboard/data-siswa",
      icon: Users,
    },
    {
      title: "Curhatan Siswa",
      url: "/dashboard/curhatan-siswa",
      icon: MessageCircle,
    },
    {
      title: "Student Cases",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Active Cases",
          url: "/dashboard/active-cases",
        },
        {
          title: "New Referrals",
          url: "/dashboard/referrals",
        },
        {
          title: "Follow-ups",
          url: "/dashboard/follow-ups",
        },
      ],
    },
    {
      title: "Mental Health",
      url: "#",
      icon: UserCheck,
      items: [
        {
          title: "Mood Tracking",
          url: "/dashboard/mood-tracking",
        },
        {
          title: "Crisis Alerts",
          url: "/dashboard/crisis-alerts",
        },
        {
          title: "Intervention Tools",
          url: "/dashboard/interventions",
        },
      ],
    },
    {
      title: "Sessions",
      url: "#",
      icon: MessageCircle,
      items: [
        {
          title: "Schedule",
          url: "/dashboard/schedule",
        },
        {
          title: "Session Notes",
          url: "/dashboard/session-notes",
        },
        {
          title: "Resources",
          url: "/dashboard/resources",
        },
      ],
    },
    {
      title: "Reports",
      url: "/dashboard/counselor-reports",
      icon: BarChart3,
    },
  ],
  head_teacher: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "School Overview",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "School Analytics",
          url: "/dashboard/school-analytics",
        },
        {
          title: "Performance Metrics",
          url: "/dashboard/performance",
        },
        {
          title: "Student Welfare",
          url: "/dashboard/student-welfare",
        },
      ],
    },
    {
      title: "Staff Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Teaching Staff",
          url: "/dashboard/teaching-staff",
        },
        {
          title: "Performance Reviews",
          url: "/dashboard/staff-reviews",
        },
        {
          title: "Professional Development",
          url: "/dashboard/staff-development",
        },
      ],
    },
    {
      title: "Academic Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Curriculum Oversight",
          url: "/dashboard/curriculum-oversight",
        },
        {
          title: "Assessment Results",
          url: "/dashboard/assessments",
        },
        {
          title: "Academic Standards",
          url: "/dashboard/standards",
        },
      ],
    },
    {
      title: "Reports",
      url: "/dashboard/head-teacher-reports",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
  super: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Multi-School Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Schools",
          url: "/dashboard/schools",
        },
        {
          title: "School Performance",
          url: "/dashboard/school-performance",
        },
        {
          title: "Resource Allocation",
          url: "/dashboard/resources",
        },
      ],
    },
    {
      title: "Platform Administration",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "System Settings",
          url: "/dashboard/system-settings",
        },
        {
          title: "Feature Management",
          url: "/dashboard/features",
        },
        {
          title: "Global Configurations",
          url: "/dashboard/global-config",
        },
      ],
    },
    {
      title: "User Administration",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/dashboard/all-users",
        },
        {
          title: "Role Management",
          url: "/dashboard/role-management",
        },
        {
          title: "Access Control",
          url: "/dashboard/access-control",
        },
      ],
    },
    {
      title: "Analytics & Reports",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Platform Analytics",
          url: "/dashboard/platform-analytics",
        },
        {
          title: "Usage Statistics",
          url: "/dashboard/usage-stats",
        },
        {
          title: "Performance Metrics",
          url: "/dashboard/performance-metrics",
        },
      ],
    },
    {
      title: "System Management",
      url: "/dashboard/system-management",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const userRole = user?.role || "admin";

  const navigation =
    roleBasedNavigation[userRole as keyof typeof roleBasedNavigation] ||
    roleBasedNavigation.admin;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Appiks</span>
                  <span className="">
                    {user?.role
                      ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(
                          1
                        )} Panel`
                      : "Dashboard"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      <Icon className="size-4" />
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>{subItem.title}</a>
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
