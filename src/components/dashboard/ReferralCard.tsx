import { Referral } from "@/types/api";
import { User, Calendar, Clock, UserCheck, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReferralCardProps {
  referral: Referral;
}

export default function ReferralCard({ referral }: ReferralCardProps) {
  // Determine colors based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Kritis":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      case "Prioritas":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  // Determine colors based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu Konfirmasi":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      case "Terkonfirmasi":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "Selesai":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "Ditolak":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const showTimer = referral.status === "Menunggu Konfirmasi";

  return (
    <Card className="p-5 flex flex-col md:flex-row gap-4 items-start w-full">
      {/* Left side: Avatar and Basic Info */}
      <div className="flex-1 space-y-4 w-full">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 text-red-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{referral.student_name}</h3>
          </div>
        </div>

        {/* Details badges */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            <span>{referral.date}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>{referral.time}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Guru BK : {referral.referrer_name}</span>
          </div>
        </div>

        {/* Expand button */}
        <button className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline mt-2">
          <span>Lihat Selengkapnya</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Right side: Status and Badges */}
      <div className="flex flex-col items-end gap-2 shrink-0 self-start w-full md:w-auto">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`font-normal border-0 ${getPriorityColor(referral.priority)}`}>
            {referral.priority}
          </Badge>
          <Badge variant="secondary" className={`font-normal border-0 ${getStatusColor(referral.status)}`}>
            {referral.status}
          </Badge>
          {referral.is_expired && !showTimer && (
            <Badge variant="secondary" className="font-normal bg-gray-100 text-gray-600 border-0 hover:bg-gray-200">
              <Clock className="w-3 h-3 mr-1" /> Kadaluarsa
            </Badge>
          )}
        </div>
        
        {showTimer && !referral.is_expired && (
          <div className="text-right mt-1">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5">Sisa Waktu Respon</p>
            <p className="text-red-500 font-semibold">{referral.remaining_time}</p>
          </div>
        )}
        
        {showTimer && referral.is_expired && (
          <div className="text-right mt-1">
            <Badge variant="secondary" className="font-normal bg-gray-100 text-gray-600 border-0">
              <Clock className="w-3 h-3 mr-1" /> Kadaluarsa
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
