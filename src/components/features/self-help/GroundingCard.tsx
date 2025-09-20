"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";

const stepConfig = [
  {
    label: "Langkah 1 : Sebutkan 5 hal yang bisa kamu lihat di sekitarmu.",
    count: 5,
    placeholder: [
      "Apa yang kamu lihat?",
      "Apa yang kamu lihat?",
      "Apa yang kamu lihat?",
      "Apa yang kamu lihat?",
      "Apa yang kamu lihat?"
    ],
    itemLabel: "Item Kamu",
  },
  {
    label: "Langkah 2 : Sentuh 4 hal yang bisa kamu rasakan dengan tanganmu.",
    count: 4,
    placeholder: [
      "Apa yang kamu rasakan?",
      "Apa yang kamu rasakan?",
      "Apa yang kamu rasakan?",
      "Apa yang kamu rasakan?",
    ],
    itemLabel: "Item Kamu",
  },
  {
    label:
      "Langkah 3 : Dengarkan 3 hal yang bisa kamu tangkap dengan telingamu.",
    count: 3,
    placeholder: [
        "Apa yang kamu dengar?",
        "Apa yang kamu dengar?",
        "Apa yang kamu dengar?"
    ],
    itemLabel: "Item Kamu",
  },
  {
    label: "Langkah 4 : Cium 2 aroma di sekitarmu, wangi atau bau tertentu.",
    count: 2,
    placeholder: [
        "Apa yang kamu cium?",
        "Apa yang kamu cium?"
    ],
    itemLabel: "Item Kamu",
  },
  {
    label:
      "Langkah 5 : Sadari 1 hal yang bisa kamu rasakan di tubuhmu atau perasaanmu saat ini.",
    count: 1,
    placeholder: [
        "Apa yang kamu rasakan?"
    ],
    itemLabel: "Item Kamu",
  },
];

export default function GroundingCard() {
  const [answers, setAnswers] = useState([
    Array(stepConfig[0].count).fill(""),
    Array(stepConfig[1].count).fill(""),
    Array(stepConfig[2].count).fill(""),
    Array(stepConfig[3].count).fill(""),
    Array(stepConfig[4].count).fill(""),
  ]);

  return (
    <Card className="w-full max-w-5xl">
      <div className="p-6 sm:p-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Grounding Sensori 5–4–3–2–1
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Teknik sederhana untuk menenangkan pikiran ✨
        </p>

        {/* Mascot */}
        <div className="flex justify-center mb-10">
          <Image
            src="/image/mascot-grounding.webp"
            alt="Grounding Mascot"
            width={300}
            height={244}
            priority
          />
        </div>

        {/* Steps */}
        <Accordion type="multiple" className="w-full space-y-4">
          {stepConfig.map((step, idx) => (
            <AccordionItem
              key={idx}
              value={`step-${idx}`}
              className="rounded-2xl border border-indigo-200 bg-indigo-50/40 shadow-sm transition hover:shadow-md"
            >
              <AccordionTrigger className="px-5 py-4 text-indigo-800 font-semibold text-md">
                <div className="flex w-full justify-between">
                  <span>{step.label}</span>
                  <div className="flex  gap-2">
                    {answers[idx].every((v) => v.trim() !== "") && (
                      <CheckCircle2 className="text-indigo-500 w-6 h-6" />
                    )}
                  </div>
                </div>
              </AccordionTrigger>

              {/* Preview Items */}
              {answers[idx].some((v) => v.trim() !== "") && (
                <div className="px-5 pt-2 pb-1">
                  <p className="text-sm text-indigo-700 mb-2 font-medium">
                    {step.itemLabel} :
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {answers[idx].filter(Boolean).map((item, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Fields */}
              <AccordionContent className="px-5 pb-5">
                <div className="space-y-3 mt-2">
                  {Array.from({ length: step.count }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-indigo-400 font-semibold w-5">
                        {i + 1}.
                      </span>
                      <Input
                        className="flex-1 border-indigo-200 rounded-lg text-sm bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
                        placeholder={step.placeholder[i] || `Item ${i + 1}`}
                        value={answers[idx][i]}
                        onChange={(e) => {
                          const newAnswers = answers.map((arr) => [...arr]);
                          newAnswers[idx][i] = e.target.value;
                          setAnswers(newAnswers);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}
