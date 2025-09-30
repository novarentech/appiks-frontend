"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { UserRole } from "@/types/auth";

export interface User {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  nip?: string; // For teachers and staff
  room?: {
    id: number;
    name: string;
    level?: string;
    code: string;
    school_id: number;
  }; // For students and teachers
  password?: string; // Optional password field
  verified?: boolean;
  mentor?: string;
}

interface UserDataTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  pageSize?: number;
}

export function UserDataTable({
  users,
  onView,
  onEdit,
  onDelete,
  pageSize = 10,
}: UserDataTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "siswa":
        return "bg-blue-100 text-blue-700";
      case "guru_wali":
        return "bg-green-100 text-green-700";
      case "guru_bk":
        return "bg-purple-100 text-purple-700";
      case "kepala_sekolah":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "siswa":
        return "Siswa";
      case "guru_wali":
        return "Guru Wali";
      case "guru_bk":
        return "Guru BK";
      case "kepala_sekolah":
        return "Kepala Sekolah";
      default:
        return role;
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3 min-w-0">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="text-xs">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{user.fullName}</p>
              {user.nip && (
                <p className="text-sm text-gray-500 truncate">{user.nip}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <span className="text-gray-600">
          {row.getValue("username")}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Kontak",
      cell: ({ row }) => (
        <span>{row.getValue("phone")}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Peran",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
            <span className="hidden sm:inline">{getRoleLabel(user.role)}</span>
            <span className="sm:hidden">
              {getRoleLabel(user.role).split(" ")[0]}
            </span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Dibuat",
      cell: ({ row }) => (
        <span className="hidden lg:block text-sm">
          {row.getValue("createdAt")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-1 min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(user)}
                  className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lihat Data</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(user)}
                  className="h-7 w-7 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Data</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(user)}
                  className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hapus</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      pageSize={pageSize}
      pageSizeOptions={[5, 10, 20, 50]}
      showPageSizeSelector={false}
      showPagination={true}
      showColumnToggle={false}
    />
  );
}

// Keep the old UserTable for backward compatibility
export const UserTable = UserDataTable;
