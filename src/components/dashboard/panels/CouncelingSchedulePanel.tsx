import { Card } from "@/components/ui/card";
import {
  Clock,
  CheckCircle,
  Calendar,
  ClipboardCheck,
  XCircle,
} from "lucide-react";

export default function CounselingSchedulePanel() {
  return (
    <Card className="w-full shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Menunggu */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              MENUNGGU
            </p>
            <p className="text-3xl font-bold text-yellow-600">1</p>
          </div>
        </div>

        {/* Disetujui */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              DISETUJUI
            </p>
            <p className="text-3xl font-bold text-blue-600">1</p>
          </div>
        </div>

        {/* Dijadwal Ulang */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              DIJADWAL ULANG
            </p>
            <p className="text-3xl font-bold text-orange-600">1</p>
          </div>
        </div>

        {/* Selesai */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <ClipboardCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              SELESAI
            </p>
            <p className="text-3xl font-bold text-green-600">1</p>
          </div>
        </div>

        {/* Dibatalkan */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              DIBATALKAN
            </p>
            <p className="text-3xl font-bold text-red-600">1</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
