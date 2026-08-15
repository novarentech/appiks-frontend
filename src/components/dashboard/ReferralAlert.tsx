import { Clock } from "lucide-react";

interface ReferralAlertProps {
  count: number;
}

export default function ReferralAlert({ count }: ReferralAlertProps) {
  if (count <= 0) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
      <div className="flex-shrink-0 mt-0.5">
        <Clock className="w-5 h-5 text-orange-500" />
      </div>
      <div>
        <h3 className="text-orange-700 font-medium">
          {count} rujukan menunggu konfirmasi Anda
        </h3>
        <p className="text-orange-600/90 text-sm mt-1">
          Psikolog memiliki 24 jam untuk merespons setiap permintaan jadwal.
        </p>
      </div>
    </div>
  );
}
