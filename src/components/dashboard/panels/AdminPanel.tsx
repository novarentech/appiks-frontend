import { Card } from "@/components/ui/card";
import { Users, ClipboardList, ThumbsUp, AlertTriangle } from "lucide-react";

export default function AdminPanel() {
  return (
    <Card className="w-full shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              TOTAL PENGGUNA
            </p>
            <p className="text-3xl font-bold text-blue-600">32</p>
          </div>
        </div>

        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <ClipboardList className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              PENGGUNA AKTIF
            </p>
            <p className="text-3xl font-bold text-purple-600">25</p>
          </div>
        </div>

        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <ThumbsUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              TOTAL KONTEN
            </p>
            <p className="text-3xl font-bold text-green-600">20</p>
          </div>
        </div>

        <div className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              KONTEN HARI INI
            </p>
            <p className="text-3xl font-bold text-orange-600">5</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
