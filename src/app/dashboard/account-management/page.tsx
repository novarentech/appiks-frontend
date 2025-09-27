"use client";

import { useAuth } from "@/hooks/useAuth";
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
import { User as ApiUser } from "@/types/api"; // Renamed to avoid conflict
import { getAllUsers, uploadBulkImportFile, deleteUser, updateUser, getRooms, getUsersByType, createUser } from "@/lib/api";

import {
  UserDataTable,
  User as ComponentUser,
} from "@/components/dashboard/account-management/user-table";
import { AccountManagementPanelStats } from "@/components/dashboard/account-management/AccountManagementPanelStats";
import { AddAccountDropdown } from "@/components/dashboard/account-management/AddAccountDropdown";
import { AddEditUserDialog } from "@/components/dashboard/account-management/AddEditUserDialog";
import { ViewUserDialog } from "@/components/dashboard/account-management/view-user-dialog";
import { DeleteUserDialog } from "@/components/dashboard/account-management/DeleteUserDialog";
import { BulkImportDialog } from "@/components/dashboard/account-management/BulkImportDialog";
import { toast } from "sonner";

// Function to map API roles to local UserRole
const mapApiRoleToUserRole = (apiRole: ApiUser["role"]): UserRole => {
  switch (apiRole) {
    case "student":
      return "siswa";
    case "teacher":
      return "guru_wali";
    case "counselor":
      return "guru_bk";
    case "headteacher":
      return "kepala_sekolah";
    case "admin":
    case "super":
      return "admin";
    default:
      return "siswa";
  }
};

// Function to transform API data to component User format
const transformApiUserToComponentUser = (apiUser: ApiUser): ComponentUser => {
  const role = mapApiRoleToUserRole(apiUser.role);

  // Format date - handle potential undefined created_at
  const createdDate = apiUser.created_at
    ? new Date(apiUser.created_at).toLocaleDateString("id-ID")
    : new Date().toLocaleDateString("id-ID");

  return {
    id: apiUser.identifier,
    fullName: apiUser.name,
    username: apiUser.username,
    phone: apiUser.phone,
    role: role,
    createdAt: createdDate,
    nip: apiUser.identifier,
    verified: apiUser.verified,
    mentor: apiUser.mentor?.name,
    room: apiUser.room,
  };
};

export default function AccountManagementPage() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();

  const [activeTab, setActiveTab] = useState<UserRole>("siswa");
  const [users, setUsers] = useState<ComponentUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [, setIsDeletingUser] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [addEditDialog, setAddEditDialog] = useState<{
    open: boolean;
    user?: ComponentUser | null;
    role?: UserRole;
  }>({ open: false });
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    user: ComponentUser | null;
  }>({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: ComponentUser | null;
  }>({ open: false, user: null });
  const [bulkImportDialog, setBulkImportDialog] = useState<{
    open: boolean;
    role?: UserRole;
  }>({ open: false });

  // Load users from API
  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await getAllUsers();

      if (response.success && Array.isArray(response.data)) {
        const transformedUsers = response.data.map(
          transformApiUserToComponentUser
        );
        setUsers(transformedUsers);
      } else {
        throw new Error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Gagal memuat data pengguna");
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (isLoading || isLoadingUsers) {
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
  const filteredUsers = users.filter((userItem) => {
    const matchesRole = userItem.role === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      userItem.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userItem.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userItem.phone.includes(searchQuery);

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

  const handleViewUser = (userItem: ComponentUser) => {
    setViewDialog({ open: true, user: userItem });
  };

  const handleEditUser = (userItem: ComponentUser) => {
    setAddEditDialog({ open: true, user: userItem });
  };

  const handleDeleteUser = (userItem: ComponentUser) => {
    setDeleteDialog({ open: true, user: userItem });
  };

  const confirmDelete = async () => {
    if (deleteDialog.user) {
      setIsDeletingUser(true);
      try {
        await deleteUser(deleteDialog.user.username);
        setUsers((prev) => prev.filter((u) => u.id !== deleteDialog.user!.id));
        toast.success("Pengguna berhasil dihapus");
        setDeleteDialog({ open: false, user: null });
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Gagal menghapus pengguna");
      } finally {
        setIsDeletingUser(false);
      }
    }
  };

  // Extended interface for user data with class property
  interface ExtendedUserData extends Partial<ComponentUser> {
    class?: string;
  }

  const handleSaveUser = async (userData: Partial<ComponentUser>) => {
    try {
      if (addEditDialog.user) {
        // Edit existing user
        const updateData: {
          name?: string;
          username?: string;
          phone?: string;
          identifier?: string;
          room_id?: string;
          mentor_id?: string;
          password?: string | null;
        } = {
          name: userData.fullName,
          username: userData.username,
          phone: userData.phone,
          identifier: userData.nip || userData.id,
          password: userData.password || null,
        };

        // Add room_id and mentor_id only for students
        if (userData.role === "siswa") {
          // Get room code (8 karakter kode kelas)
          // We need to fetch rooms data to get the room code
          try {
            const roomsResponse = await getRooms();
            const extendedUserData = userData as ExtendedUserData;
            if (roomsResponse.success && extendedUserData.class) {
              const room = roomsResponse.data.find((r: { id: number; code: string }) =>
                r.id.toString() === extendedUserData.class
              );
              if (room) {
                updateData.room_id = room.code;
              }
            }
          } catch (error) {
            console.error("Error fetching rooms:", error);
          }
          
          // Get mentor NIP
          // We need to fetch mentors data to get the mentor identifier
          try {
            const mentorsResponse = await getUsersByType("teacher");
            if (mentorsResponse.success && userData.mentor) {
              const mentor = mentorsResponse.data.find((m: ApiUser) =>
                (m.id && m.id.toString() === userData.mentor) ||
                m.identifier === userData.mentor
              );
              if (mentor) {
                updateData.mentor_id = mentor.identifier;
              }
            }
          } catch (error) {
            console.error("Error fetching mentors:", error);
          }
        }

        const response = await updateUser(addEditDialog.user.username, updateData);
        
        if (response.success) {
          // Update local state
          setUsers((prev) =>
            prev.map((u) =>
              u.id === addEditDialog.user!.id ? { ...u, ...userData } : u
            )
          );
          toast.success("Pengguna berhasil diperbarui");
        } else {
          throw new Error(response.message || "Gagal memperbarui pengguna");
        }
      } else {
        // Add new user
        // Map role to API format
        let apiRole: "teacher" | "headteacher" | "counselor";
        switch (userData.role) {
          case "guru_wali":
            apiRole = "teacher";
            break;
          case "kepala_sekolah":
            apiRole = "headteacher";
            break;
          case "guru_bk":
            apiRole = "counselor";
            break;
          default:
            apiRole = "teacher";
        }

        const createUserData = {
          name: userData.fullName!,
          username: userData.username!,
          identifier: userData.nip || userData.id!,
          phone: userData.phone!,
          role: apiRole,
          password: userData.password!,
        };

        const response = await createUser(createUserData);
        
        if (response.success) {
          // Add new user to local state
          const newUser: ComponentUser = {
            id: Date.now().toString(),
            fullName: userData.fullName!,
            username: userData.username!,
            phone: userData.phone!,
            role: userData.role!,
            createdAt: new Date().toLocaleDateString("id-ID"),
            nip: userData.nip,
            verified: false,
            mentor: userData.mentor,
          };
          setUsers((prev) => [...prev, newUser]);
          toast.success("Pengguna berhasil ditambahkan");
        } else {
          throw new Error(response.message || "Gagal menambah pengguna");
        }
      }
      setAddEditDialog({ open: false });
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Gagal menyimpan data pengguna");
    }
  };

  const handleBulkImport = async (file: File) => {
    try {
      const response = await uploadBulkImportFile(file);
      console.log("Import successful:", response.data);
      toast.success("Import data berhasil!");
      // Reload users after successful import
      await loadUsers();
      setBulkImportDialog({ open: false });
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Terjadi kesalahan saat mengimpor data");
      throw error; // Re-throw to let the dialog handle the error
    }
  };

  const tabConfig = [
    {
      value: "siswa" as const,
      label: "Akun Siswa",
      count: users.filter((u) => u.role === "siswa").length,
    },
    {
      value: "guru_wali" as const,
      label: "Akun Guru Wali",
      count: users.filter((u) => u.role === "guru_wali").length,
    },
    {
      value: "guru_bk" as const,
      label: "Akun Guru BK",
      count: users.filter((u) => u.role === "guru_bk").length,
    },
    {
      value: "kepala_sekolah" as const,
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
            {/* Controls */}
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
