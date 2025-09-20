import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "Rina Sari Dewi",
    role: "Siswa",
    initials: "RD",
    date: "27 Agustus 2025",
  },
  {
    id: 2,
    name: "Anna Visconti",
    role: "Guru Wali",
    initials: "AV",
    date: "27 Agustus 2025",
  },
  {
    id: 3,
    name: "Astrid Andersen",
    role: "Guru BK",
    initials: "AA",
    date: "27 Agustus 2025",
  },
];

export default function NewUserCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Pengguna Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockUsers.map((user) => (
          <div key={user.id} className="border-l-4 border-cyan-500 pl-4 py-2">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-sm">{user.name}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  user.role === "Siswa"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                    : user.role === "Guru Wali"
                    ? "bg-pink-100 text-pink-700 border-pink-300"
                    : "bg-blue-100 text-blue-700 border-blue-300"
                }`}
              >
                {user.role}
              </Badge>
              <span className="text-xs text-gray-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {user.date}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
