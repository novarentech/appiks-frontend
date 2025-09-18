"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

const affirmationCards = [
  {
    key: "calm",
    color: "border-violet-200 bg-violet-50 hover:border-violet-400",
    icon: "/icon/ico-heart-purple.webp",
    title: "Tenang & Atasi Cemas",
    desc: "Kalimat positif untuk membantu menenangkan pikiran.",
  },
  {
    key: "sadness",
    color: "border-sky-200 bg-sky-50 hover:border-sky-400",
    icon: "/icon/ico-heart-blue.webp",
    title: "Hadapi Kegagalan & Kesedihan",
    desc: "Kalimat positif untuk menguatkan hati saat menghadapi hal sulit.",
  },
  {
    key: "acceptance",
    color: "border-yellow-200 bg-yellow-50 hover:border-yellow-400",
    icon: "/icon/ico-heart-yellow.webp",
    title: "Penerimaan Diri",
    desc: "Kalimat positif untuk belajar mencintai dan menerima diri apa adanya.",
  },
  {
    key: "confidence",
    color: "border-pink-200 bg-pink-50 hover:border-pink-400",
    icon: "/icon/ico-heart-pink.webp",
    title: "Percaya Diri",
    desc: "Kalimat positif untuk menumbuhkan keyakinan pada diri sendiri.",
  },
];

export default function AffirmationSelect() {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="p-6 sm:p-10">
        <div className="text-center font-semibold text-lg mb-1">
          Pilih kartu afirmasi sesuai kebutuhanmu !
        </div>
        <div className="text-center text-gray-500 mb-6 text-sm">
          Baca atau dengarkan dengan tenang, ulangi dalam hati atau ucapkan
          dengan suara pelan.
        </div>
        <div className="flex justify-center my-10">
          <Image
            src="/image/mascot-affirmation.webp"
            alt="maskot"
            width={357}
            height={232}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {affirmationCards.map((card) => (
            <button
              key={card.key}
              type="button"
              className={`rounded-xl border p-6 flex flex-col items-center transition-all ${card.color}`}
              onClick={() => router.push(`/self-help/affirmation/${card.key}`)}
            >
              <Image
                src={card.icon}
                alt={card.title}
                width={80}
                height={80}
                className="mb-2 size-20 m-4"
              />
              <div className="font-semibold text-lg mb-1">{card.title}</div>
              <div className="text-sm text-gray-500 text-center">
                {card.desc}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
