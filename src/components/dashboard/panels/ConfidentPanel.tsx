import { Card } from "@/components/ui/card";
import { Users, ClipboardList, ThumbsUp, AlertTriangle } from "lucide-react";

export default function ConfidentPanel() {
  return (
    <Card className="w-full shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Jumlah Siswa Diampu */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              BELUM DIBALAS
            </p>
            <p className="text-3xl font-bold text-blue-600">20</p>
          </div>
        </div>

        {/* Laporan Mood Hari Ini */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <ClipboardList className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              DIBALAS
            </p>
            <p className="text-3xl font-bold text-purple-600">5</p>
          </div>
        </div>

        {/* Mood Aman */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <ThumbsUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              SELESAI
            </p>
            <p className="text-3xl font-bold text-green-600">10</p>
          </div>
        </div>

        {/* Mood Tidak Aman */}
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                TOTAL
            </p>
            <p className="text-3xl font-bold text-orange-600">40</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
