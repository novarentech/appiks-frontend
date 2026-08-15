import { Referral } from "@/types/api";
import Link from "next/link";
import {
  User,
  Calendar,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ReferralCardProps {
  referral: Referral;
}

export default function ReferralCard({ referral }: ReferralCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card className="p-5 flex flex-col w-full transition-all duration-200">
      <div className="flex flex-col md:flex-row gap-4 items-start w-full">
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

          {/* Expand button (Visible only when NOT expanded) */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline mt-2"
            >
              <span>Lihat Selengkapnya</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side: Status and Badges */}
        <div className="flex flex-col items-end gap-2 shrink-0 self-start w-full md:w-auto mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`font-normal border-0 ${getPriorityColor(referral.priority)}`}
            >
              {referral.priority}
            </Badge>
            <Badge
              variant="secondary"
              className={`font-normal border-0 ${getStatusColor(referral.status)}`}
            >
              {referral.status}
            </Badge>
            {referral.is_expired && !showTimer && (
              <Badge
                variant="secondary"
                className="font-normal bg-gray-100 text-gray-600 border-0 hover:bg-gray-200"
              >
                <Clock className="w-3 h-3 mr-1" /> Kadaluarsa
              </Badge>
            )}
          </div>

          {showTimer && !referral.is_expired && (
            <div className="text-right mt-1">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5">
                Sisa Waktu Respon
              </p>
              <p className="text-red-500 font-semibold">
                {referral.remaining_time}
              </p>
            </div>
          )}

          {showTimer && referral.is_expired && (
            <div className="text-right mt-1">
              <Badge
                variant="secondary"
                className="font-normal bg-gray-100 text-gray-600 border-0"
              >
                <Clock className="w-3 h-3 mr-1" /> Kadaluarsa
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Catatan Awal Guru BK :
            </h4>
            <p className="text-sm text-gray-600 italic">
              "{referral.counselor_notes}"
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Diajukan pada : {referral.submitted_at}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {referral.status === "Menunggu Konfirmasi" && (
                <>
                  <Button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white min-w-[120px]"
                    disabled={referral.is_expired}
                  >
                    Konfirmasi
                  </Button>
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-500 hover:bg-indigo-50 min-w-[120px]"
                    disabled={referral.is_expired}
                  >
                    Tolak Jadwal
                  </Button>
                </>
              )}

              {referral.status === "Terkonfirmasi" && (
                <>
                  <Button className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]">
                    Buka Laporan AI
                  </Button>
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-500 hover:bg-indigo-50 min-w-[120px]"
                  >
                    Ubah Jadwal
                  </Button>
                </>
              )}

              {referral.status === "Selesai" && (
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 min-w-[120px]"
                >
                  Lihat Laporan
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <Link 
                href={`/dashboard/rujukan-masuk/${referral.id}`}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
          >
            <ChevronUp className="w-4 h-4" />
            <span>Sembunyikan</span>
          </button>
        </div>
      )}
    </Card>
  );
}
