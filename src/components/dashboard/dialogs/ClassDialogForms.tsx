"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye, Edit, Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ClassItem } from "@/components/data-display/tables/ClassDataTable";

// Static tingkat options for form
const staticTingkatOptions = [
  { value: "X", label: "X" },
  { value: "XI", label: "XI" },
  { value: "XII", label: "XII" },
];

// Separate memoized DialogForm component to prevent re-renders
interface DialogFormProps {
  type: "tambah" | "edit" | "lihat";
  readOnly?: boolean;
  localForm: Partial<ClassItem>;
  handleFormChange: (field: keyof ClassItem, value: string) => void;
  onTambah: (formData: Partial<ClassItem>) => void;
  onEdit: (formData: Partial<ClassItem>) => void;
  addLoading?: boolean;
}

const DialogForm = memo(function DialogForm({
  type,
  readOnly = false,
  localForm,
  handleFormChange,
  onTambah,
  onEdit,
  addLoading = false,
}: DialogFormProps) {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!localForm.name || !localForm.level) {
      toast.error("Form tidak lengkap. Semua field harus diisi.");
      return;
    }

    if (type === "tambah") {
      onTambah(localForm);
    } else if (type === "edit") {
      onEdit(localForm);
    }
  }, [localForm, onTambah, onEdit, type]);

  // Check if form is valid
  const isFormValid = localForm.name && localForm.level;

  // Debug: Log level value
  useEffect(() => {
    console.log("DialogForm localForm.level:", localForm.level);
  }, [localForm.level]);

  return (
    <div className="w-full">
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="flex items-center gap-2 text-xl">
          {type === "tambah" ? (
            <>
              <Plus className="h-6 w-6 text-[#6C63FF]" />
              Tambah Kelas
            </>
          ) : type === "edit" ? (
            <>
              <Edit className="h-6 w-6 text-[#6C63FF]" />
              Edit Kelas
            </>
          ) : (
            <>
              <Eye className="h-6 w-6 text-[#6C63FF]" />
              Detail Kelas
            </>
          )}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        {type === "edit" && (
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">
              Nama Sekolah
            </label>
            <Input
              placeholder="Nama Sekolah"
              value={localForm.school?.name || ""}
              disabled={true}
              className=""
            />
          </div>
        )}
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">
            Nama Kelas
            {(type === "tambah" || type === "edit") && <span className="text-red-500">*</span>}
          </label>
          <Input
            placeholder="Nama Kelas"
            value={localForm.name || ""}
            onChange={(e) => handleFormChange("name", e.target.value)}
            disabled={readOnly}
            className=""
            required={type === "tambah" || type === "edit"}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">
            Tingkat
            {(type === "tambah" || type === "edit") && <span className="text-red-500">*</span>}
          </label>
          <Select
            key={localForm.level} // Force re-render when level changes
            value={localForm.level || ""}
            onValueChange={(v) => handleFormChange("level", v)}
            disabled={readOnly}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Pilih Tingkat" />
            </SelectTrigger>
            <SelectContent>
              {staticTingkatOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {(type === "tambah" || type === "edit") && (
        <DialogFooter className="pt-4 border-t gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!isFormValid || (type === "tambah" && addLoading)}
          >
            {type === "tambah" ? (
              addLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menambah...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </>
              )
            ) : (
              <>
                <Edit className="w-4 h-4 mr-1" />
                Simpan
              </>
            )}
          </Button>
        </DialogFooter>
      )}
    </div>
  );
});

// Detail view component
const DialogLihat = memo(function DialogLihat({
  localForm,
}: {
  localForm: Partial<ClassItem>;
}) {
  return (
    <div className="w-full">
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-[#37364F]">
          <Eye className="h-7 w-7 text-[#6C63FF]" />
          Detail Kelas
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Nama Sekolah</label>
          <Input value={localForm.school?.name || ""} disabled className="h-12" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">
              Nama Kelas
            </label>
            <Input value={localForm.name || ""} disabled className="h-12" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Tingkat</label>
            <Input value={localForm.level || ""} disabled className="h-12" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Kode Kelas</label>
          <Input value={localForm.code || ""} disabled className="h-12" />
        </div>
      </div>
      <DialogFooter className="pt-4 border-t flex flex-row gap-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Batal
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
});

// Delete dialog component
const DialogHapus = memo(function DialogHapus({
  row,
  onDelete,
  deleteLoading = false,
}: {
  row?: ClassItem;
  onDelete: () => void;
  deleteLoading?: boolean;
}) {
  return (
    <div className="w-full">
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="flex items-center gap-2 text-xl">
          <Trash2 className="w-8 h-8 text-[#FF5A5F]" />
          Hapus Kelas
        </DialogTitle>
      </DialogHeader>
      <div className="text-center py-4">
        <p>
          Yakin ingin menghapus kelas <b>{row?.name}</b>?
        </p>
      </div>
      <DialogFooter className="pt-4 border-t flex flex-row gap-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={deleteLoading}>
            Batal
          </Button>
        </DialogClose>
        <Button 
          type="button" 
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700"
          disabled={deleteLoading}
        >
          {deleteLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menghapus...
            </>
          ) : (
            "Hapus"
          )}
        </Button>
      </DialogFooter>
    </div>
  );
});

interface ClassDialogFormsProps {
  openDialog: { type: "lihat" | "edit" | "hapus" | "tambah"; row?: ClassItem } | null;
  onTambah: (formData: Partial<ClassItem>) => void;
  onEdit: (formData: Partial<ClassItem>) => void;
  onDelete: () => void;
  setOpenDialog: (dialog: null | { type: "lihat" | "edit" | "hapus" | "tambah"; row?: ClassItem }) => void;
  deleteLoading?: boolean;
  addLoading?: boolean;
}

export default function ClassDialogForms({
  openDialog,
  onTambah,
  onEdit,
  onDelete,
  deleteLoading = false,
  addLoading = false,
}: ClassDialogFormsProps) {
  // Local form state - this prevents parent re-renders on every keystroke
  const [localForm, setLocalForm] = useState<Partial<ClassItem>>({});

  // Initialize form when dialog opens or changes
  useEffect(() => {
    console.log("ClassDialogForms openDialog:", openDialog);
    
    if (openDialog?.type === "tambah") {
      setLocalForm({});
    } else if (openDialog?.type === "edit" || openDialog?.type === "lihat") {
      if (openDialog.row) {
        console.log("Setting form with row data:", openDialog.row);
        console.log("Row level value:", openDialog.row.level);
        
        // Set the form with all data
        setLocalForm({
          id: openDialog.row.id,
          name: openDialog.row.name,
          level: openDialog.row.level,
          code: openDialog.row.code,
          school_id: openDialog.row.school_id,
          school: openDialog.row.school,
          created_at: openDialog.row.created_at,
          mention: openDialog.row.mention,
        });
      }
    }
  }, [openDialog]);

  // Debug: Log when localForm changes
  useEffect(() => {
    console.log("localForm updated:", localForm);
    console.log("localForm.level:", localForm.level);
  }, [localForm]);

  // Local form handler - no parent communication until submit
  const handleFormChange = useCallback((field: keyof ClassItem, value: string) => {
    console.log(`handleFormChange: ${field} = ${value}`);
    setLocalForm(prev => ({ ...prev, [field]: value }));
  }, []);

  if (!openDialog) return null;

  return (
    <>
      {openDialog.type === "tambah" && (
        <DialogForm
          type="tambah"
          localForm={localForm}
          handleFormChange={handleFormChange}
          onTambah={onTambah}
          onEdit={onEdit}
          addLoading={addLoading}
        />
      )}
      {openDialog.type === "edit" && (
        <DialogForm
          type="edit"
          localForm={localForm}
          handleFormChange={handleFormChange}
          onTambah={onTambah}
          onEdit={onEdit}
        />
      )}
      {openDialog.type === "lihat" && (
        <DialogLihat localForm={localForm} />
      )}
      {openDialog.type === "hapus" && (
        <DialogHapus 
          row={openDialog.row} 
          onDelete={onDelete}
          deleteLoading={deleteLoading}
        />
      )}
    </>
  );
}