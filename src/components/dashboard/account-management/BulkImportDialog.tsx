"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/auth";
import {
  Upload,
  FileSpreadsheet,
  Download,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole;
  onImport: (file: File) => void;
}

export function BulkImportDialog({
  open,
  onOpenChange,
  role,
  onImport,
}: BulkImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
        return "Pengguna";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "File harus berformat .xlsx atau .xls";
    }

    if (file.size > maxSize) {
      return "Ukuran file tidak boleh lebih dari 5MB";
    }

    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const error = validateFile(file);

      if (error) {
        setUploadError(error);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);

      if (error) {
        setUploadError(error);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      await onImport(selectedFile);
      setSelectedFile(null);
      setUploadError(null);
      onOpenChange(false);
    } catch (error) {
      setUploadError("Terjadi kesalahan saat mengimpor file");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    // This would typically download a template file
    const link = document.createElement("a");
    link.href = `/templates/template-${role}.xlsx`;
    link.download = `template-${getRoleLabel(role)
      .toLowerCase()
      .replace(" ", "-")}.xlsx`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            <span>Import Akun {getRoleLabel(role)}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Section */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">
                  Import Data Massal
                </h4>
                <p className="text-sm text-blue-700">
                  Unggah file Excel (.xlsx) untuk menambahkan multiple akun
                  sekaligus. Pastikan format file sesuai dengan template yang
                  disediakan.
                </p>
              </div>
            </div>
          </div>

          {/* Download Template Button */}
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template Excel
          </Button>

          {/* Error Message */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-700 font-medium">
                  {uploadError}
                </p>
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive
                ? "border-blue-400 bg-blue-50 scale-105"
                : uploadError
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileSpreadsheet
                  className={`w-8 h-8 ${
                    dragActive
                      ? "text-blue-500"
                      : uploadError
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                />
              </div>

              {selectedFile ? (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-800">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-green-600">
                          Ukuran: {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadError(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Ganti file
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    {dragActive
                      ? "Lepaskan file di sini"
                      : "Klik untuk memilih file atau drag & drop"}
                  </p>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
                      Format: .xlsx, .xls • Maksimal: 5MB
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            disabled={isImporting}
          >
            Batal
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isImporting || !!uploadError}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto disabled:opacity-50"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengimpor...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import{" "}
                {selectedFile
                  ? `(${Math.round(selectedFile.size / 1024)} KB)`
                  : "Akun"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
