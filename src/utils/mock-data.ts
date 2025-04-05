// Navigation items type
export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type NavLink = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
};

import {
  LayoutDashboard,
  Calendar,
  Package,
  DollarSign,
  ClipboardList,
  Lock,
  CalendarX,
  UserPlus
} from 'lucide-react';

import { Icons } from "@/components/icons"

export const dashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Event Request",
    href: "/dashboard/event-request",
  },
  {
    title: "Fund Analysis",
    href: "/dashboard/fund-analysis",
  },
  {
    title: "Request Status",
    href: "/dashboard/request-status",
  },
  {
    title: "Report",
    href: "/dashboard/report",
  },
  {
    title: "Collaboration",
    href: "/dashboard/collaboration",
  },
  {
    title: "Resource Availability",
    href: "/dashboard/resource-availability",
  },
  {
    title: "Cancel Event",
    href: "/dashboard/cancel-event",
  },
  {
    title: "Change Password",
    href: "/dashboard/change-password",
  },
];

export const adminDashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Resource Request",
    href: "/admin/resource-request",
  },
  {
    title: "User Management",
    href: "/admin/user-management",
  },
  {
    title: "Cancel Event",
    href: "/admin/cancel-event",
  },
  {
    title: "Change Password",
    href: "/admin/change-password",
  },
];

export const facultyDashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/faculty",
  },
  {
    title: "Event Request",
    href: "/faculty/event-request",
  },
  {
    title: "Fund Request",
    href: "/faculty/fund-request",
  },
  {
    title: "Cancel Event",
    href: "/faculty/cancel-event",
  },
  {
    title: "Change Password",
    href: "/faculty/change-password",
  },
];

// Sidebar navigation items
export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layoutDashboard",
  },
  {
    title: "Event Request",
    href: "/dashboard/event-request",
    icon: "calendar",
  },
  {
    title: "Fund Analysis",
    href: "/dashboard/fund-analysis",
    icon: "dollarSign",
  },
  {
    title: "Request Status",
    href: "/dashboard/request-status",
    icon: "clipboardList",
  },
  {
    title: "Report",
    href: "/dashboard/report",
    icon: "clipboardList",
  },
  {
    title: "Collaboration",
    href: "/dashboard/collaboration",
    icon: "clipboardList",
  },
  {
    title: "Resource Availability",
    href: "/dashboard/resource-availability",
    icon: "package",
  },
  {
    title: "Cancel Event",
    href: "/dashboard/cancel-event",
    icon: "calendarX",
  },
  {
    title: "Change Password",
    href: "/dashboard/change-password",
    icon: "lock",
  },
];

// Admin sidebar navigation items
export const adminSidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "layoutDashboard",
  },
  {
    title: "Resource Request",
    href: "/admin/resource-request",
    icon: "package",
  },
  {
    title: "User Management",
    href: "/admin/user-management",
    icon: "userPlus",
  },
  {
    title: "Cancel Event",
    href: "/admin/cancel-event",
    icon: "calendarX",
  },
  {
    title: "Change Password",
    href: "/admin/change-password",
    icon: "lock",
  },
];

// Faculty sidebar navigation items
export const facultySidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/faculty",
    icon: "layoutDashboard",
  },
  {
    title: "Event Request",
    href: "/faculty/event-request",
    icon: "calendar",
  },
  {
    title: "Fund Request",
    href: "/faculty/fund-request",
    icon: "dollarSign",
  },
  {
    title: "Cancel Event",
    href: "/faculty/cancel-event",
    icon: "calendarX",
  },
  {
    title: "Change Password",
    href: "/faculty/change-password",
    icon: "lock",
  },
];

// Resource labels map
export const RESOURCE_LABELS: { [key: string]: string } = {
  'mba-seminar-hall': 'MBA Seminar Hall',
  'main-seminar-hall': 'Main Seminar Hall',
  'ccf-lab': 'CCF Lab',
  'auditorium': 'Auditorium',
  'pes-field': 'PES Field'
};
