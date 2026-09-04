import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, User, ChevronRight, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { MonitoringCase } from "@/data/mockMonitoring";

interface MonitoringCaseCardProps {
  item: MonitoringCase;
}

export function MonitoringCaseCard({ item }: MonitoringCaseCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Belum Ditangani BK":
        return "bg-red-50 text-red-600";
      case "Sedang Ditangani BK":
        return "bg-cyan-50 text-cyan-600";
      case "Dirujuk ke Psikolog":
        return "bg-blue-50 text-blue-600";
      case "Diselesaikan":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getSlaBadge = (slaStatus: string) => {
    if (slaStatus === "DALAM BATAS WAKTU") {
      return (
        <span className="flex items-center text-xs font-semibold text-green-600 tracking-wider">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {slaStatus}
        </span>
      );
    }
    return (
      <span className="flex items-center text-xs font-semibold text-red-500 tracking-wider">
        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
        {slaStatus}
      </span>
    );
  };

  return (
    <Card className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Top Row: Name and Status */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{item.studentName}</h3>
          <p className="text-sm text-gray-500">{item.className}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className={`border-0 px-3 py-1 text-xs font-medium ${getStatusStyle(item.status)}`}>
            {item.status}
          </Badge>
          {getSlaBadge(item.slaStatus)}
        </div>
      </div>

      {/* Bottom Row: Details and Link */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-100">
            <Calendar className="w-3.5 h-3.5" />
            {item.date}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-100">
            <Clock className="w-3.5 h-3.5" />
            {item.time}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-100">
            <User className="w-3.5 h-3.5" />
            Guru BK : {item.counselorName}
          </div>
        </div>
        
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 mt-2">
              Lihat Detail
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Ringkasan Penanganan Kasus</DialogTitle>
              <DialogDescription className="text-gray-500">
                Informasi ditampilkan terbatas untuk menjaga privasi siswa
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-gray-50 rounded-xl p-5 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Nama Siswa</p>
                <p className="font-bold text-gray-900">{item.studentName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Kelas</p>
                <p className="font-bold text-gray-900">{item.className}</p>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-sm font-medium text-gray-500">Tanggal Trigger</p>
                <p className="font-bold text-gray-900">08/27/2025 09:00 AM</p>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className={`border-0 px-2 py-0.5 text-xs font-medium ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </Badge>
                  {getSlaBadge(item.slaStatus)}
                </div>
              </div>
              <div className="space-y-1 mt-2 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Guru BK PIC</p>
                <p className="font-bold text-gray-900">{item.counselorName}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Timeline Penanganan</h4>
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-2">
                {item.timeline && item.timeline.length > 0 ? (
                  item.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-sm font-medium text-gray-500">{step.date} {step.time}</span>
                        <span className="text-sm text-gray-700">{step.description}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic pl-6">Belum ada timeline penanganan.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4">
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-6 rounded-xl text-lg font-semibold" onClick={() => setIsDetailOpen(false)}>
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
