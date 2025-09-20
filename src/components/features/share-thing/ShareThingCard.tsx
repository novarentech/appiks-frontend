"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ShareThingCard() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <Card className="w-full max-w-5xl">
      <CardContent className="p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Ceritakan lebih lanjut
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Informasi ini akan membantu kami memberikan saran yang lebih tepat
        </p>
        <div className="flex justify-center mb-8">
          <Image
            src="/image/mascot-share.webp"
            alt="maskot"
            width={200}
            height={200}
            priority
          />
        </div>
        <div className="mb-8">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            Ceritakan hal apa yang membuat mood–mu kurang baik hari ini.
          </h3>
          <p className="text-gray-500 text-sm mb-3">Tulis disini</p>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1">Judul</label>
            <Input
              placeholder="Stress Menghadapi Ujian"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Isi</label>
            <Textarea
              placeholder="Type your message here."
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-40"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
          >
            Kirim
            <Send className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
