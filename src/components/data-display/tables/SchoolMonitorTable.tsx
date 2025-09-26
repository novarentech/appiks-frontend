"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  getProvinces, 
  getCitiesByProvince, 
  getDistrictsByCity,
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool
} from "@/lib/api";
import { School as ApiSchool } from "@/types/api";

export interface School {
  id: string;
  nama: string;
  kecamatan: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  email: string;
}

export default function SchoolMonitorTable() {
  const [data, setData] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [kecamatanFilter, setKecamatanFilter] = useState("all");
  const [kotaFilter, setKotaFilter] = useState("all");
  const [provinsiFilter, setProvinsiFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  // API data states
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [, setLoadingSchools] = useState(false);

  // Form location states
  const [formCities, setFormCities] = useState<string[]>([]);
  const [formDistricts, setFormDistricts] = useState<string[]>([]);
  const [loadingFormCities, setLoadingFormCities] = useState(false);
  const [loadingFormDistricts, setLoadingFormDistricts] = useState(false);

  // Dialog state
  const [openDialog, setOpenDialog] = useState<null | {
    type: "lihat" | "edit" | "hapus" | "tambah";
    row?: School;
  }>(null);

  // Form state
  const [form, setForm] = useState<Partial<School>>({});

  // Load provinces and schools on component mount
  useEffect(() => {
    loadProvinces();
    loadSchools();
  }, []);

  // Load cities when province filter changes
  useEffect(() => {
    if (provinsiFilter && provinsiFilter !== "all") {
      loadCities(provinsiFilter);
    } else {
      setCities([]);
      setDistricts([]);
      setKotaFilter("all");
      setKecamatanFilter("all");
    }
  }, [provinsiFilter]);

  // Load districts when city filter changes
  useEffect(() => {
    if (kotaFilter && kotaFilter !== "all") {
      loadDistricts(kotaFilter);
    } else {
      setDistricts([]);
      setKecamatanFilter("all");
    }
  }, [kotaFilter]);

  // Ensure kecamatan filter is disabled when province is "all"
  useEffect(() => {
    if (provinsiFilter === "all") {
      setKecamatanFilter("all");
    }
  }, [provinsiFilter]);

  // Debounced API calls for form location data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoadFormCities = useCallback(
    debounce((province: string) => {
      if (province && province !== "") {
        loadFormCities(province);
      } else {
        setFormCities([]);
        setFormDistricts([]);
        setForm(prev => ({ ...prev, kota: "", kecamatan: "" }));
      }
    }, 300),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoadFormDistricts = useCallback(
    debounce((city: string) => {
      if (city && city !== "") {
        loadFormDistricts(city);
      } else {
        setFormDistricts([]);
        setForm(prev => ({ ...prev, kecamatan: "" }));
      }
    }, 300),
    []
  );

  // Load form cities when form province changes (with debouncing)
  useEffect(() => {
    debouncedLoadFormCities(form.provinsi || "");
  }, [form.provinsi, debouncedLoadFormCities]);

  // Load form districts when form city changes (with debouncing)
  useEffect(() => {
    debouncedLoadFormDistricts(form.kota || "");
  }, [form.kota, debouncedLoadFormDistricts]);

  // Phone validation function
  const validatePhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");
    const isValidLength = digitsOnly.length >= 9 && digitsOnly.length <= 13;
    const startsWithValidDigit = /^[8-9]/.test(digitsOnly);

    return {
      isValidLength,
      startsWithValidDigit,
      isValid: isValidLength && startsWithValidDigit,
    };
  };

  // Debounce utility function
  function debounce<T extends (...args: string[]) => void>(
    func: T,
    wait: number
  ): T {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  }

  const loadProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await getProvinces();
      if (response.success) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error("Failed to load provinces:", error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadCities = async (province: string) => {
    setLoadingCities(true);
    try {
      const response = await getCitiesByProvince(province);
      if (response.success) {
        setCities(response.data);
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  const loadDistricts = async (city: string) => {
    setLoadingDistricts(true);
    try {
      const response = await getDistrictsByCity(city);
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      console.error("Failed to load districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadFormCities = async (province: string) => {
    setLoadingFormCities(true);
    try {
      const response = await getCitiesByProvince(province);
      if (response.success) {
        setFormCities(response.data);
      }
    } catch (error) {
      console.error("Failed to load form cities:", error);
    } finally {
      setLoadingFormCities(false);
    }
  };

  const loadFormDistricts = async (city: string) => {
    setLoadingFormDistricts(true);
    try {
      const response = await getDistrictsByCity(city);
      if (response.success) {
        setFormDistricts(response.data);
      }
    } catch (error) {
      console.error("Failed to load form districts:", error);
    } finally {
      setLoadingFormDistricts(false);
    }
  };

  const loadSchools = async () => {
    setLoadingSchools(true);
    try {
      const response = await getSchools();
      if (response.success) {
        // Transform API data to component format
        const transformedData = response.data.map((school: ApiSchool) => ({
          id: school.id.toString(),
          nama: school.name,
          kecamatan: school.district,
          alamat: school.address,
          kota: school.city,
          provinsi: school.province,
          telepon: school.phone,
          email: school.email,
        }));
        setData(transformedData);
      }
    } catch (error) {
      console.error("Failed to load schools:", error);
    } finally {
      setLoadingSchools(false);
    }
  };

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesKecamatan =
        kecamatanFilter === "all" || item.kecamatan === kecamatanFilter;
      const matchesKota = kotaFilter === "all" || item.kota === kotaFilter;
      const matchesProvinsi =
        provinsiFilter === "all" || item.provinsi === provinsiFilter;
      return matchesSearch && matchesKecamatan && matchesKota && matchesProvinsi;
    });
  }, [data, searchQuery, kecamatanFilter, kotaFilter, provinsiFilter]);

  // Table columns
  const columns: ColumnDef<School>[] = [
    {
      accessorKey: "nama",
      header: "Sekolah",
      cell: ({ row }) => <div className="font-medium">{row.original.nama}</div>,
    },
    {
      accessorKey: "kecamatan",
      header: "Kecamatan",
      cell: ({ row }) => <div>{row.original.kecamatan}</div>,
    },
    {
      accessorKey: "kota",
      header: "Kota/Kabupaten",
      cell: ({ row }) => <div>{row.original.kota}</div>,
    },
    {
      accessorKey: "provinsi",
      header: "Provinsi",
      cell: ({ row }) => <div>{row.original.provinsi}</div>,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenDialog({ type: "lihat", row: item });
                      setForm(item);
                    }}
                    className="h-8 w-8 p-0 bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                  >
                    <Eye className="h-4 w-4" />
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
                    onClick={() => {
                      setOpenDialog({ type: "edit", row: item });
                      // Set form with the item data to trigger API calls for dependent selects
                      setForm(item);
                    }}
                    className="h-8 w-8 p-0 bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    <Edit className="h-4 w-4" />
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
                    onClick={() => setOpenDialog({ type: "hapus", row: item })}
                    className="h-8 w-8 p-0 bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hapus</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  // Dialog form handlers - optimized with useCallback
  const handleFormChange = React.useCallback((field: keyof School, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTambah = async (formData: Partial<School>) => {
    // Validate the submitted form data
    if (
      !formData.nama ||
      !formData.kecamatan ||
      !formData.alamat ||
      !formData.kota ||
      !formData.provinsi ||
      !formData.telepon ||
      !formData.email
    ) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    // Validate phone number
    const phoneValidation = validatePhone(formData.telepon);
    if (!phoneValidation.isValid) {
      toast.error("Nomor telepon tidak valid!");
      return;
    }

    try {
      const schoolData = {
        name: formData.nama!,
        address: formData.alamat!,
        phone: formData.telepon!,
        email: formData.email!,
        district: formData.kecamatan!,
        city: formData.kota!,
        province: formData.provinsi!,
      };

      const response = await createSchool(schoolData);
      
      if (response.success) {
        // Transform the response data to component format
        const newSchool = {
          id: response.data.id.toString(),
          nama: response.data.name,
          kecamatan: response.data.district,
          alamat: response.data.address,
          kota: response.data.city,
          provinsi: response.data.province,
          telepon: response.data.phone,
          email: response.data.email,
        };
        
        setData((prev) => [...prev, newSchool]);
        setForm({});
        setOpenDialog(null);
        toast.success("Sekolah berhasil ditambahkan!");
      } else {
        toast.error("Gagal menambahkan sekolah: " + response.message);
      }
    } catch (error) {
      console.error("Failed to create school:", error);
      toast.error("Gagal menambahkan sekolah. Silakan coba lagi.");
    }
  };

  const handleEdit = async (formData: Partial<School>) => {
    // Validate the submitted form data
    if (
      !formData.nama ||
      !formData.kecamatan ||
      !formData.alamat ||
      !formData.kota ||
      !formData.provinsi ||
      !formData.telepon ||
      !formData.email ||
      !formData.id
    ) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    // Validate phone number
    const phoneValidation = validatePhone(formData.telepon);
    if (!phoneValidation.isValid) {
      toast.error("Nomor telepon tidak valid!");
      return;
    }

    try {
      const schoolId = parseInt(formData.id!, 10);
      if (isNaN(schoolId)) {
        toast.error("ID sekolah tidak valid!");
        return;
      }

      const schoolData = {
        name: formData.nama!,
        address: formData.alamat!,
        phone: formData.telepon!,
        email: formData.email!,
        district: formData.kecamatan!,
        city: formData.kota!,
        province: formData.provinsi!,
      };

      const response = await updateSchool(schoolId, schoolData);
      
      if (response.success) {
        // Transform the response data to component format
        const updatedSchool = {
          id: response.data.id.toString(),
          nama: response.data.name,
          kecamatan: response.data.district,
          alamat: response.data.address,
          kota: response.data.city,
          provinsi: response.data.province,
          telepon: response.data.phone,
          email: response.data.email,
        };
        
        setData((prev) =>
          prev.map((item) =>
            item.id === formData.id ? updatedSchool : item
          )
        );
        setForm({});
        setOpenDialog(null);
        toast.success("Sekolah berhasil diperbarui!");
      } else {
        toast.error("Gagal memperbarui sekolah: " + response.message);
      }
    } catch (error) {
      console.error("Failed to update school:", error);
      toast.error("Gagal memperbarui sekolah. Silakan coba lagi.");
    }
  };

  const handleDelete = async () => {
    if (!openDialog?.row?.id) return;

    try {
      const schoolId = parseInt(openDialog.row.id, 10);
      if (isNaN(schoolId)) {
        toast.error("ID sekolah tidak valid!");
        return;
      }

      const response = await deleteSchool(schoolId);
      
      if (response.success) {
        setData((prev) => prev.filter((item) => item.id !== openDialog.row!.id));
        setForm({});
        setOpenDialog(null);
        toast.success("Sekolah berhasil dihapus!");
      } else {
        toast.error("Gagal menghapus sekolah: " + response.message);
      }
    } catch (error) {
      console.error("Failed to delete school:", error);
      toast.error("Gagal menghapus sekolah. Silakan coba lagi.");
    }
  };

  // Extracted DialogForm component with local state management
  const DialogForm = React.memo(function DialogForm({
    type,
    readOnly = false,
    initialData,
    onSubmit,
    provinces,
    formCities,
    formDistricts,
    loadingFormCities,
    loadingFormDistricts,
    onFormChange,
  }: {
    type: "tambah" | "edit" | "lihat";
    readOnly?: boolean;
    initialData: Partial<School>;
    onSubmit: (data: Partial<School>) => void;
    provinces: string[];
    formCities: string[];
    formDistricts: string[];
    loadingFormCities: boolean;
    loadingFormDistricts: boolean;
    onFormChange: (field: keyof School, value: string) => void;
  }) {
    // Local form state to prevent re-renders from parent
    const [localForm, setLocalForm] = useState<Partial<School>>(initialData);

    // Phone validation function
    const validatePhone = (phone: string) => {
      const digitsOnly = phone.replace(/\D/g, "");
      const isValidLength = digitsOnly.length >= 9 && digitsOnly.length <= 13;
      const startsWithValidDigit = /^[8-9]/.test(digitsOnly);

      return {
        isValidLength,
        startsWithValidDigit,
        isValid: isValidLength && startsWithValidDigit,
      };
    };

    // Sync with parent when initialData changes (for edit mode)
    useEffect(() => {
      setLocalForm(initialData);
    }, [initialData]);

    const handleLocalFormChange = (field: keyof School, value: string) => {
      setLocalForm(prev => ({ ...prev, [field]: value }));
      // Only update parent state for location fields to trigger API calls
      if (field === 'provinsi' || field === 'kota' || field === 'kecamatan') {
        onFormChange(field, value);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(localForm);
    };

    // Phone validation state
    const phoneValidation = validatePhone(localForm.telepon || "");

    return (
      <form
        className="w-full"
        onSubmit={handleSubmit}
      >
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {type === "tambah" ? (
              <>
              <Plus className="h-6 w-6 text-[#6C63FF]" />
              Tambah Sekolah
              </>
            ) : type === "edit" ? (
              <>
              <Edit className="h-6 w-6 text-[#6C63FF]" />
              Edit Sekolah
              </>
            ) : (
              <>
              <Eye className="h-6 w-6 text-[#6C63FF]" />
              Detail Sekolah
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nama Sekolah<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nama Sekolah"
                value={localForm.nama || ""}
                onChange={(e) => handleLocalFormChange("nama", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Alamat<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Alamat"
                value={localForm.alamat || ""}
                onChange={(e) => handleLocalFormChange("alamat", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Kecamatan<span className="text-red-500">*</span>
              </label>
              <Select
                value={localForm.kecamatan || ""}
                onValueChange={(v) => handleLocalFormChange("kecamatan", v)}
                disabled={!localForm.kota || readOnly || loadingFormDistricts}
              >
                <SelectTrigger className="w-full h-12">
                  {loadingFormDistricts ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SelectValue placeholder="Pilih Kecamatan" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {formDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Kota/Kabupaten<span className="text-red-500">*</span>
              </label>
              <Select
                value={localForm.kota || ""}
                onValueChange={(v) => handleLocalFormChange("kota", v)}
                disabled={!localForm.provinsi || readOnly || loadingFormCities}
              >
                <SelectTrigger className="w-full h-12">
                  {loadingFormCities ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SelectValue placeholder="Pilih Kota/Kabupaten" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {formCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Provinsi<span className="text-red-500">*</span>
              </label>
              <Select
                value={localForm.provinsi || ""}
                onValueChange={(v) => handleLocalFormChange("provinsi", v)}
                disabled={readOnly}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Telepon<span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +62
                </div>
                <Input
                  value={localForm.telepon || ""}
                  onChange={(e) => {
                    // Remove any non-digit characters
                    let value = e.target.value.replace(/\D/g, "");
                    // Remove leading zero if present
                    if (value.startsWith("0")) {
                      value = value.substring(1);
                    }
                    handleLocalFormChange("telepon", value);
                  }}
                  placeholder="812-3456-7890"
                  type="tel"
                  disabled={readOnly}
                  className={
                    localForm.telepon?.trim() === ""
                      ? "border-red-300 focus:border-red-500 rounded-l-none"
                      : "rounded-l-none"
                  }
                  required
                />
              </div>
              {localForm.telepon?.trim() === "" && (
                <p className="text-sm text-red-500 mt-1">
                  Nomor telepon wajib diisi
                </p>
              )}
              {localForm.telepon?.trim() !== "" && !phoneValidation.isValid && (
                <div className="text-xs mt-1">
                  <p className="text-red-500 font-medium mb-1">
                    Nomor telepon harus memenuhi kriteria berikut:
                  </p>
                  <ul className="space-y-1">
                    <li
                      className={
                        phoneValidation.isValidLength
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      9-13 digit (tanpa +62){" "}
                      {phoneValidation.isValidLength ? "✓" : "✗"}
                    </li>
                    <li
                      className={
                        phoneValidation.startsWithValidDigit
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      Dimulai dengan 8 atau 9{" "}
                      {phoneValidation.startsWithValidDigit ? "✓" : "✗"}
                    </li>
                  </ul>
                </div>
              )}
              {localForm.telepon?.trim() !== "" && phoneValidation.isValid && (
                <p className="text-sm text-gray-500 mt-1">
                  Format: 62{localForm.telepon}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email<span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Email"
                value={localForm.email || ""}
                onChange={(e) => handleLocalFormChange("email", e.target.value)}
                disabled={readOnly}
                type="email"
                required
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4 border-t gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          {type !== "lihat" && (
            <Button
              type="submit"
              className="bg-[#6C63FF] hover:bg-[#554fd8] text-white flex items-center gap-2"
              disabled={
                !localForm.nama ||
                !localForm.kecamatan ||
                !localForm.alamat ||
                !localForm.kota ||
                !localForm.provinsi ||
                !localForm.telepon ||
                !localForm.email ||
                !phoneValidation.isValid
              }
            >
              {type === "tambah" ? (
                <>
                  Tambah <Plus className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Simpan <Edit className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </form>
    );
  });

  function DialogDelete() {
    return (
      <div>
        <DialogHeader>
          <DialogTitle>
            <Trash2 className="h-6 w-6 text-red-600 inline-block mr-2" />
            Hapus Sekolah
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Apakah Anda yakin ingin menghapus sekolah{" "}
          <span className="font-semibold">{openDialog?.row?.nama}</span>?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Hapus
          </Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Controls Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-48"
            />
          </div>
          <Select value={kecamatanFilter} onValueChange={setKecamatanFilter} disabled={!kotaFilter || kotaFilter === "all" || loadingDistricts}>
            <SelectTrigger className="w-full sm:w-40">
              {loadingDistricts ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="Pilih Kecamatan" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kecamatan</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={kotaFilter} onValueChange={setKotaFilter} disabled={!provinsiFilter || provinsiFilter === "all" || loadingCities}>
            <SelectTrigger className="w-full sm:w-40">
              {loadingCities ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="Pilih Kota/Kabupaten" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={provinsiFilter} onValueChange={setProvinsiFilter} disabled={loadingProvinces}>
            <SelectTrigger className="w-full sm:w-40">
              {loadingProvinces ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="Pilih Provinsi" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Provinsi</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Baris per halaman:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
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
          <Button
            onClick={() => {
              setOpenDialog({ type: "tambah" });
              setForm({});
            }}
            className="bg-[#6C63FF] hover:bg-[#554fd8] text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Sekolah
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        showColumnToggle={false}
        showPagination={true}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        showPageSizeSelector={false}
      />

      {/* Dialogs */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {openDialog?.type === "tambah" && (
            <DialogForm
              type="tambah"
              initialData={form}
              onSubmit={handleTambah}
              provinces={provinces}
              formCities={formCities}
              formDistricts={formDistricts}
              loadingFormCities={loadingFormCities}
              loadingFormDistricts={loadingFormDistricts}
              onFormChange={handleFormChange}
            />
          )}
          {openDialog?.type === "edit" && (
            <DialogForm
              type="edit"
              initialData={form}
              onSubmit={handleEdit}
              provinces={provinces}
              formCities={formCities}
              formDistricts={formDistricts}
              loadingFormCities={loadingFormCities}
              loadingFormDistricts={loadingFormDistricts}
              onFormChange={handleFormChange}
            />
          )}
          {openDialog?.type === "lihat" && (
            <DialogForm
              type="lihat"
              readOnly={true}
              initialData={form}
              onSubmit={() => {}}
              provinces={provinces}
              formCities={formCities}
              formDistricts={formDistricts}
              loadingFormCities={loadingFormCities}
              loadingFormDistricts={loadingFormDistricts}
              onFormChange={handleFormChange}
            />
          )}
          {openDialog?.type === "hapus" && <DialogDelete />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
