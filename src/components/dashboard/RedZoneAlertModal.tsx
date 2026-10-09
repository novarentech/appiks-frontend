import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getHeadTeacherIncidents, HeadTeacherIncident } from "@/lib/api";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function RedZoneAlertModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [incidents, setIncidents] = useState<HeadTeacherIncident[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await getHeadTeacherIncidents();
        if (res.success && res.data && res.data.length > 0) {
          const activeIncidents = res.data.filter((i: any) => i.acknowledged_at === null);
          if (activeIncidents.length > 0) {
            setIncidents(activeIncidents);
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch red zone incidents:", err);
      }
    };
    fetchIncidents();
  }, []);

  const currentIncident = incidents[0];

  const handleCloseCurrent = () => {
    if (incidents.length > 1) {
      setIncidents(prev => prev.slice(1));
    } else {
      setIsOpen(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority?.toLowerCase() === "tinggi" || priority?.toLowerCase() === "kritis") {
      return "bg-red-50 text-red-600 border-red-200";
    }
    return "bg-yellow-50 text-yellow-600 border-yellow-200";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "menunggu":
      case "belum ditinjau":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "confirmed":
      case "dijadwalkan":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "finished":
      case "selesai":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "rejected":
      case "ditolak":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "menunggu persetujuan siswa":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "menunggu persetujuan rujukan":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "expired":
        return "bg-gray-50 text-gray-500 border-gray-200";
      case "bukan urgent":
        return "bg-slate-50 text-slate-700 border-slate-200";
      case "sudah ditanggapi":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (!isOpen || !currentIncident) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 border-none rounded-2xl overflow-hidden shadow-2xl [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Kasus Baru Terdeteksi</DialogTitle>
        </VisuallyHidden>
        <div className="bg-white">
          <div className="p-6 pb-2 relative">
            <button 
              onClick={handleCloseCurrent}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold text-gray-500">Kasus Baru Terdeteksi</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 ml-7">Red Zone Alert</h2>
          </div>

          <div className="px-6 py-4">
            <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentIncident.student_name || "Siswa Anonim"}
                </h3>
                <Badge variant="outline" className={`px-2 py-0 text-[10px] uppercase font-bold tracking-wider rounded ${getPriorityBadge(currentIncident.priority)}`}>
                  {currentIncident.priority === "tinggi" ? "Kritis" : currentIncident.priority}
                </Badge>
              </div>
              
              <div className="space-y-2.5 text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-20">Kelas</span>
                  <span className="font-medium text-gray-900">: {currentIncident.class_name || "Belum ada data kelas"}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-20">Guru BK</span>
                  <span className="font-medium text-gray-900">: {currentIncident.assigned_counselor || "-"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-20">Status</span>
                  <span className="font-medium mr-1">:</span>
                  <Badge variant="outline" className={`font-normal border ${getStatusColor(currentIncident.status)}`}>
                    {currentIncident.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-2 flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCloseCurrent}
              className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold focus:ring-0"
            >
              Tutup {incidents.length > 1 ? `(Tersisa ${incidents.length - 1})` : ""}
            </Button>
            <Button 
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/monitoring-penanganan");
              }}
              className="flex-1 bg-[#e53e51] hover:bg-red-700 text-white font-semibold focus:ring-0"
            >
              Lihat Detail
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
