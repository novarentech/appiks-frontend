import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface StatItem {
  icon: LucideIcon | IconType;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

interface DashboardPanelProps {
  items: StatItem[];
  gridCols?: string;
}

function getGridColsClass(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  if (count === 3) return "grid-cols-1 md:grid-cols-3";
  if (count === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  if (count === 5) return "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";
  if (count === 6) return "grid-cols-1 md:grid-cols-3 lg:grid-cols-6";
  return "grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
}

export default function DashboardPanel({
  items,
  gridCols,
}: DashboardPanelProps) {
  const dynamicGridCols = gridCols || getGridColsClass(items.length);

  return (
    <Card className="w-full shadow-none">
      <div className={`grid ${dynamicGridCols} divide-y md:divide-y-0 md:divide-x divide-gray-200`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="p-6 flex items-center space-x-4">
              <div className={`p-3 ${item.bgColor} rounded-full`}>
                <Icon className={`w-6 h-6 ${item.textColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {item.label}
                </p>
                <p className={`text-3xl font-bold ${item.textColor}`}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}