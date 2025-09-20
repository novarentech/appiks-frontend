"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { UserRole } from "@/types/auth";

import {
  UserDataTable,
  User,
} from "@/components/dashboard/account-management/user-table";
import { AccountManagementPanelStats } from "@/components/dashboard/account-management/AccountManagementPanelStats";
import { AddAccountDropdown } from "@/components/dashboard/account-management/AddAccountDropdown";
import { AddEditUserDialog } from "@/components/dashboard/account-management/AddEditUserDialog";
import { ViewUserDialog } from "@/components/dashboard/account-management/view-user-dialog";
import { DeleteUserDialog } from "@/components/dashboard/account-management/DeleteUserDialog";
import { BulkImportDialog } from "@/components/dashboard/account-management/BulkImportDialog";

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    fullName: "Rina Sari Dewi",
    username: "rina_097",
    phone: "081345123",
    role: "siswa",
    createdAt: "27/08/2025",
    class: "X IPA 1",
  },
  {
    id: "2",
    fullName: "Anna Visconti",
    username: "Anna_vis",
    phone: "081345123",
    role: "siswa",
    createdAt: "27/08/2025",
    class: "X IPA 2",
  },
  {
    id: "3",
    fullName: "Astrid Andersen",
    username: "andersen",
    phone: "081345123",
    role: "siswa",
    createdAt: "27/08/2025",
    class: "XI IPA 1",
  },
  {
    id: "4",
    fullName: "David Kim",
    username: "kim_david",
    phone: "081345123",
    role: "guru_wali",
    createdAt: "25/08/2025",
    nip: "197805152006041001",
    class: "XI IPA 1",
  },
  {
    id: "5",
    fullName: "Diego Mendoza",
    username: "diego_san",
    phone: "081345123",
    role: "guru_bk",
    createdAt: "25/08/2025",
    nip: "198203102008011002",
  },
  {
    id: "6",
    fullName: "Fatim Al-Sayed",
    username: "fatim120",
    phone: "081345123",
    role: "kepala_sekolah",
    createdAt: "25/08/2025",
    nip: "196512081990032001",
  },
  // Add more users for better demo
  {
    id: "7",
    fullName: "Ahmad Rahman",
    username: "ahmad_r",
    phone: "081234567",
    role: "siswa",
    createdAt: "09/09/2025",
    class: "XII IPA 1",
  },
  {
    id: "8",
    fullName: "Siti Nurhaliza",
    username: "siti_n",
    phone: "081234568",
    role: "guru_bk",
    createdAt: "09/09/2025",
    nip: "198505152010012003",
  },
];

export default function AccountManagementPage() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<UserRole>("siswa");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState(""); // Dialog states
  const [addEditDialog, setAddEditDialog] = useState<{
    open: boolean;
    user?: User | null;
    role?: UserRole;
  }>({ open: false });
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [bulkImportDialog, setBulkImportDialog] = useState<{
    open: boolean;
    role?: UserRole;
  }>({ open: false });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isVerified)) {
      router.push("/login");
      return;
    }

    if (!isLoading && user && !["admin"].includes(user.role)) {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, isAuthenticated, isVerified, user, router]);

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

  if (
    !isAuthenticated ||
    !isVerified ||
    !user ||
    !["admin"].includes(user.role)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  // Filter users by active tab and search query
  const filteredUsers = users.filter((user) => {
    const matchesRole = user.role === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    return matchesRole && matchesSearch;
  });

  // Handle functions
  const handleAddAccount = (role: UserRole) => {
    if (role === "siswa") {
      setBulkImportDialog({ open: true, role });
    } else {
      setAddEditDialog({ open: true, role });
    }
  };

  const handleViewUser = (user: User) => {
    setViewDialog({ open: true, user });
  };

  const handleEditUser = (user: User) => {
    setAddEditDialog({ open: true, user });
  };

  const handleDeleteUser = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const confirmDelete = () => {
    if (deleteDialog.user) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteDialog.user!.id));
    }
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (addEditDialog.user) {
      // Edit existing user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === addEditDialog.user!.id ? { ...u, ...userData } : u
        )
      );
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        fullName: userData.fullName!,
        username: userData.username!,
        phone: userData.phone!,
        role: userData.role!,
        createdAt: new Date().toLocaleDateString("id-ID"),
        nip: userData.nip,
        class: userData.class,
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setAddEditDialog({ open: false });
  };

  const handleBulkImport = (file: File) => {
    // Handle bulk import logic here
    console.log("Importing file:", file);
  };

  const tabConfig = [
    {
      value: "siswa",
      label: "Akun Siswa",
      count: users.filter((u) => u.role === "siswa").length,
    },
    {
      value: "guru_wali",
      label: "Akun Guru Wali",
      count: users.filter((u) => u.role === "guru_wali").length,
    },
    {
      value: "guru_bk",
      label: "Akun Guru BK",
      count: users.filter((u) => u.role === "guru_bk").length,
    },
    {
      value: "kepala_sekolah",
      label: "Kepala Sekolah",
      count: users.filter((u) => u.role === "kepala_sekolah").length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Akun</h1>
        <p className="text-gray-600 mt-2">Kelola Akun dan Pengguna Appiks</p>
      </div>

      {/* Statistics Panel */}
      <AccountManagementPanelStats role={activeTab} users={users} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as UserRole)}
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-12 bg-gray-50 rounded-lg p-1">
          {tabConfig.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <span className="hidden md:inline truncate">{tab.label}</span>
              <span className="md:hidden text-xs font-semibold">
                {tab.label.split(" ").slice(-1)[0]}
              </span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold min-w-[24px] text-center">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabConfig.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {/* Controls - Moved here */}
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4 sm:justify-between sm:items-center my-4">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari nama, username, atau nomor telepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-80"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Baris per halaman:
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(Number(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-shrink-0">
                  <AddAccountDropdown onAddAccount={handleAddAccount} />
                </div>
              </div>
            </div>

            <UserDataTable
              users={filteredUsers}
              onView={handleViewUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              pageSize={pageSize}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal Dialogs */}
      {/* Add/Edit User Dialog */}
      <AddEditUserDialog
        open={addEditDialog.open}
        onOpenChange={(open) => setAddEditDialog({ ...addEditDialog, open })}
        user={addEditDialog.user}
        role={addEditDialog.role}
        onSave={handleSaveUser}
      />

      {/* View User Details Dialog */}
      <ViewUserDialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}
        user={viewDialog.user}
      />

      {/* Delete User Confirmation Dialog */}
      <DeleteUserDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        user={deleteDialog.user}
        onConfirm={confirmDelete}
      />

      {/* Bulk Import Dialog */}
      <BulkImportDialog
        open={bulkImportDialog.open}
        onOpenChange={(open) =>
          setBulkImportDialog({ ...bulkImportDialog, open })
        }
        role={bulkImportDialog.role!}
        onImport={handleBulkImport}
      />
    </div>
  );
}
