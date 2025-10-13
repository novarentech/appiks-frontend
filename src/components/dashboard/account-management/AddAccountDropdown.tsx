"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  ChevronDown,
  Users,
  GraduationCap,
  UserCheck,
  Crown,
  User2,
} from "lucide-react";
import { UserRole } from "@/types/auth";

interface AddAccountDropdownProps {
  onAddAccount: (role: UserRole, isImport?: boolean) => void;
}

export function AddAccountDropdown({ onAddAccount }: AddAccountDropdownProps) {
  const accountTypes = [
    {
      role: "siswa" as UserRole,
      label: "Import Akun Siswa",
      icon: Users,
      isImport: true,
    },
    {
      role: "siswa" as UserRole,
      label: "Tambah Akun Siswa",
      icon: User2,
      isImport: false,
    },
    {
      role: "guru_wali" as UserRole,
      label: "Tambah Akun Guru Wali",
      icon: GraduationCap,
      isImport: false,
    },
    {
      role: "guru_bk" as UserRole,
      label: "Tambah Akun Guru BK",
      icon: UserCheck,
      isImport: false,
    },
    {
      role: "kepala_sekolah" as UserRole,
      label: "Tambah Kepala Sekolah",
      icon: Crown,
      isImport: false,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Akun
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {accountTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <DropdownMenuItem
              key={`${type.role}-${type.isImport}`}
              onClick={() => onAddAccount(type.role, type.isImport)}
              className="flex items-center p-3 cursor-pointer"
            >
              <IconComponent className="w-4 h-4" />
              <div className="flex-1">
                <p className="font-medium text-sm">{type.label}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
