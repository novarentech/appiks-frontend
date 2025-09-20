import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Video } from "lucide-react";

const mockContent = [
  {
    id: 1,
    title: "Membangun Kesadaran Diri & Kesehatan Mental di Kalangan Siswa",
    type: "Video",
    date: "27 Agustus 2025",
  },
  {
    id: 2,
    title:
      "Stop Intoleransi: Wujudkan Lingkungan Sekolah yang Peduli & Sehat Mental",
    type: "Artikel",
    date: "27 Agustus 2025",
  },
  {
    id: 3,
    title:
      "Pentingnya Self-Awareness bagi Siswa untuk Cegah Tekanan Mental & Intoleransi",
    type: "Artikel",
    date: "27 Agustus 2025",
  },
];

export default function NewContentCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Konten Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockContent.map((content) => (
          <div
            key={content.id}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <h3 className="font-medium text-sm leading-tight mb-2">
              {content.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={content.type === "Video" ? "default" : "secondary"}
                className={`text-xs ${
                  content.type === "Video"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {content.type === "Video" ? (
                  <>
                    <Video className="w-3 h-3 mr-1" />
                    Video
                  </>
                ) : (
                  <>
                    <FileText className="w-3 h-3 mr-1" />
                    Artikel
                  </>
                )}
              </Badge>
              <span className="text-xs text-gray-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {content.date}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
