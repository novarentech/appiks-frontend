import { Calendar } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ 
  title = "Selamat Datang", 
  subtitle = "Kelola Akun dan Konten dengan Mudah",
  actions
}: DashboardHeaderProps) {
  return (
    <div className="sm:flex items-center justify-between ">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 mt-4 sm:mt-0">
        <div className="text-sm text-gray-600 bg-gray-100 border py-2.5 px-4 rounded-lg flex items-center">
          <Calendar className="inline mr-2 h-4 w-4" />
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
        </div>
        {actions}
      </div>
    </div>
  );
}